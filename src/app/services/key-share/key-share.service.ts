import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs'
import { PublicKeyShareGroup, SerializedPublicKeyShareGroup } from 'src/app/models/AirGapMarketWalletGroup'
import { PublicKeyShare } from 'src/app/types/KeyShareSync'
import { WalletStorageKey, WalletStorageService } from '../storage/storage'

export interface PublicKeyShareAddInfo {
  keyShare: PublicKeyShare
  groupId?: string
  groupLabel?: string
  options?: { override?: boolean; updateState?: boolean }
}

export type ImplicitWalletGroup = 'all'
export type ActiveWalletGroup = PublicKeyShareGroup | ImplicitWalletGroup

@Injectable({
  providedIn: 'root'
})
export class KeyShareService {
  private readonly activeGroup$: ReplaySubject<ActiveWalletGroup> = new ReplaySubject(1)
  private readonly keyShareGroups: Map<string | undefined, PublicKeyShareGroup> = new Map()
  public keySharesHaveLoaded: ReplaySubject<boolean> = new ReplaySubject(1)

  public keyShares$: ReplaySubject<PublicKeyShare[]> = new ReplaySubject(1)
  public keyShareGroups$: ReplaySubject<PublicKeyShareGroup[]> = new ReplaySubject(1)
  public allKeyShares$: ReplaySubject<PublicKeyShare[]> = new ReplaySubject(1)

  public get allKeyShareGroups(): PublicKeyShareGroup[] {
    return Array.from(this.keyShareGroups.values())
  }

  private get allKeyShares(): PublicKeyShare[] {
    return this.allKeyShareGroups.reduce((keyShares: PublicKeyShare[], group: PublicKeyShareGroup) => keyShares.concat(group.keyShares), [])
  }
  constructor(private readonly storageProvider: WalletStorageService) {
    this.loadKeySyncsFromStorage()
      .then(() => {
        this.keySharesHaveLoaded.next(true)
      })
      .catch(console.error)
  }

  private async loadKeySyncsFromStorage() {
    const [rawGroups, rawKeyShares]: [SerializedPublicKeyShareGroup[] | undefined, PublicKeyShare[] | undefined] = await Promise.all([
      this.storageProvider.get(WalletStorageKey.KEYSHARE_GROUPS),
      this.storageProvider.get(WalletStorageKey.KEYSHARE)
    ])

    console.log(rawGroups) // TODO JGD
    let keyShares = rawKeyShares || []

    // migrating double-serialization
    if (!(rawKeyShares instanceof Array)) {
      try {
        keyShares = JSON.parse(rawKeyShares)
      } catch (e) {
        keyShares = []
      }
    }

    // "keyShares" can be undefined here
    if (!keyShares) {
      keyShares = []
    }

    this.setActiveGroup(this.allKeyShareGroups.length > 1 ? 'all' : this.allKeyShareGroups[0])
    this.keyShareGroups$.next(this.allKeyShareGroups)
  }

  public async addKeyShares(keyShareAddInfos: PublicKeyShareAddInfo[]): Promise<void> {
    let existingKeyShares = []
    for (let keyShareAddInfo of keyShareAddInfos) {
      const defaultOptions = {
        override: false,
        updateState: true
      }

      const resolvedOptions = {
        ...defaultOptions,
        ...(keyShareAddInfo.options ?? {})
      }

      const alreadyExists: boolean = this.keyShareExists(keyShareAddInfo.keyShare)
      if (alreadyExists) {
        existingKeyShares.push(keyShareAddInfo.keyShare)
        if (!resolvedOptions.override) {
          throw new Error('keyShare already exists')
        }
      }
      await this.addKeyShare(keyShareAddInfo, resolvedOptions)
    }
  }

  public keyShareExists(testKeyShare: PublicKeyShare): boolean {
    return this.allKeyShares.some(
      (keyShare: PublicKeyShare) => this.isSameKeyShare(keyShare, testKeyShare) && keyShare.pk === testKeyShare.pk
    )
  }

  private async addKeyShare(
    keyShareAddInfo: PublicKeyShareAddInfo,
    resolvedOptions: {
      override: boolean
      updateState: boolean
    }
  ): Promise<void> {
    this.assertWalletGroupExists(keyShareAddInfo.groupId, keyShareAddInfo.groupLabel)
    this.assertWalletGroupUpdated(keyShareAddInfo.groupId, keyShareAddInfo.groupLabel)

    const keyShareGroup: PublicKeyShareGroup = this.keyShareGroups.get(keyShareAddInfo.groupId)
    this.addToGroup(keyShareGroup, keyShareAddInfo.keyShare)

    if (resolvedOptions.updateState) {
      this.setActiveGroup(keyShareGroup)
      this.keyShareGroups$.next(this.allKeyShareGroups)
      return this.persist()
    }
  }

  public isSameKeyShare(keyShare1: PublicKeyShare, keyShare2: PublicKeyShare) {
    return (
      keyShare1.pk === keyShare2.pk &&
      keyShare1.proof.challenge === keyShare2.proof.challenge &&
      keyShare1.proof.response === keyShare2.proof.response
    )
  }

  private assertWalletGroupExists(groupId: string | undefined, groupLabel: string | undefined): void {
    if (!this.keyShareGroups.has(groupId)) {
      this.keyShareGroups.set(groupId, new PublicKeyShareGroup(groupId, groupLabel, undefined, []))
    }
  }

  private assertWalletGroupUpdated(groupId: string | undefined, groupLabel: string | undefined): void {
    const keyShareGroup: PublicKeyShareGroup = this.keyShareGroups.get(groupId)
    if (keyShareGroup.label !== undefined && keyShareGroup.label !== groupLabel && groupLabel !== undefined) {
      keyShareGroup.updateLabel(groupLabel)
    }
  }

  private addToGroup(group: PublicKeyShareGroup, keyShare: PublicKeyShare): void {
    const [oldGroupId, oldIndex]: [string | undefined, number] = this.findWalletGroupIdAndIndex(keyShare)
    if (oldGroupId !== group.id && oldIndex > -1) {
      this.keyShareGroups.get(oldGroupId).keyShares.splice(oldIndex, 1)
    }

    if (oldGroupId === group.id && oldIndex > -1) {
      group.keyShares[oldIndex] = keyShare
    } else {
      group.keyShares.push(keyShare)
    }
  }

  public findWalletGroupIdAndIndex(testWallet: PublicKeyShare): [string | undefined, number] {
    for (const group of this.keyShareGroups.values()) {
      const index: number = group.keyShares.findIndex((keyShare: PublicKeyShare) => this.isSameKeyShare(keyShare, testWallet))
      if (index !== -1) {
        return [group.id, index]
      }
    }

    return [undefined, -1]
  }

  public setActiveGroup(groupToSet: PublicKeyShareGroup | ImplicitWalletGroup | undefined): void {
    console.log('setActiveGroup allKeyShares', this.allKeyShares)
    if (groupToSet === 'all') {
      this.activeGroup$.next(groupToSet)
      this.keyShares$.next(this.allKeyShares)
    } else if (groupToSet !== undefined && this.keyShareGroups.has(groupToSet.id)) {
      const group: PublicKeyShareGroup = this.keyShareGroups.get(groupToSet.id)
      const keyShares: PublicKeyShare[] = group.keyShares

      this.activeGroup$.next(group)
      this.keyShares$.next(keyShares)
    } else {
      this.keyShares$.next([])
    }
    this.allKeyShares$.next(this.allKeyShares)
  }

  private async persist(): Promise<void> {
    await Promise.all([
      this.storageProvider.set(
        WalletStorageKey.KEYSHARE_GROUPS,
        this.allKeyShareGroups.filter((group: PublicKeyShareGroup) => !group.transient).map((group: PublicKeyShareGroup) => group.toJSON())
      ),
      this.storageProvider.set(
        WalletStorageKey.KEYSHARE,
        this.allKeyShares.map((keyShare: PublicKeyShare) => keyShare)
      )
    ])
  }
}
