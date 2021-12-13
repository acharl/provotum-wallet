import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, ReplaySubject, Subscription } from 'rxjs'
import { Platform } from '@ionic/angular'

import { ErrorCategory, handleErrorSentry } from '../../services/sentry-error-handler/sentry-error-handler'

import { Uint8PublicKeyShare } from 'src/app/types/KeyShareSync'
import { KeyShareService } from 'src/app/services/key-share/key-share.service'

interface WalletGroup {
  keyShare: Uint8PublicKeyShare
}

@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html',
  styleUrls: ['./portfolio.scss']
})
export class PortfolioPage {
  private subscription: Subscription

  public isVisible = 'hidden'

  public total: number = 0
  public changePercentage: number = 0

  public keyShares: Observable<Uint8PublicKeyShare[]>
  public keyShareGroups: ReplaySubject<Uint8PublicKeyShare[]> = new ReplaySubject(1)

  public walletGroups: ReplaySubject<WalletGroup[]> = new ReplaySubject(1)
  public isDesktop: boolean = false

  constructor(private readonly router: Router, private readonly keyShareService: KeyShareService, public platform: Platform) {
    this.isDesktop = !this.platform.is('hybrid')

    this.keyShares = this.keyShareService.keyShares$.asObservable()

    // If a keyShare gets added or removed, recalculate all values
    this.subscription = this.keyShares.subscribe((keyShares: Uint8PublicKeyShare[]) => {
      this.refreshWalletGroups(keyShares)
    })
  }

  private refreshWalletGroups(keyShares: Uint8PublicKeyShare[]) {
    const groups: WalletGroup[] = []

    const walletMap: Map<string, WalletGroup> = new Map()

    keyShares.forEach((keyShare: Uint8PublicKeyShare) => {
      const walletKey: string = `${keyShare.pk.toString()}`

      if (walletMap.has(walletKey)) {
        const group: WalletGroup = walletMap.get(walletKey)
        group.keyShare = keyShare
      } else {
        walletMap.set(walletKey, { keyShare })
      }
    })

    walletMap.forEach((value: WalletGroup) => {
      groups.push(value)
    })

    groups.sort((group1: WalletGroup, group2: WalletGroup) => {
      if (group1.keyShare && group2.keyShare) {
        return group1.keyShare.pk.toString().localeCompare(group2.keyShare.pk.toString())
      } else if (group1.keyShare) {
        return -1
      } else if (group2.keyShare) {
        return 1
      } else {
        return 0
      }
    })

    // TODO: Find a solution to this
    /*
    It seems like this is an Ionic / Angular bug. If a keyShare is deleted on a sub-page
    (which is how it is done currently), then the UI end up in a weird state. There is no
    crash, but some keyShares are not shown and empty cards are being displayed. To resolve this,
    the app has to be restarted or another keyShare has to be added. When investigating,
    we saw that it is related to the transition phase. If the observable emits at the same time
    as the transition is happening, then this weird state occurs. If we simply wait, everything
    works as intended. 
    */
    setTimeout(() => {
      this.walletGroups.next(groups)
    }, 500)
  }

  public openDetail(_mainWallet: Uint8PublicKeyShare, _subWallet?: Uint8PublicKeyShare) {
    console.log(JSON.stringify(_mainWallet))
  }

  public openAccountAddPage() {
    this.router.navigateByUrl('/account-add').catch(handleErrorSentry(ErrorCategory.NAVIGATION))
  }

  doRefresh(_event: any) {}

  public ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
