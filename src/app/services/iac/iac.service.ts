import {
  AppConfig,
  APP_CONFIG,
  BaseIACService,
  ClipboardService,
  DeeplinkService,
  IACMessageTransport,
  ProtocolService,
  RelayMessage,
  UiEventElementsService
} from '@airgap/angular-core'
// import { BeaconMessageType, SigningType, SignPayloadResponseInput } from '@airgap/beacon-sdk'
import { Inject, Injectable } from '@angular/core'
import {
  AccountShareResponse,
  AirGapMarketWallet,
  AirGapWalletStatus,
  IACMessageDefinitionObject,
  IACMessageType
  // MainProtocolSymbols,
  // MessageSignResponse,
  // ProtocolSymbols
} from '@airgap/coinlib-core'
import { Router } from '@angular/router'

import { AccountSync } from '../../types/AccountSync'
import { AccountProvider } from '../account/account.provider'
import { BeaconService } from '../beacon/beacon.service'
import { DataService, DataServiceKey } from '../data/data.service'
import { PriceService } from '../price/price.service'
import { ErrorCategory, handleErrorSentry } from '../sentry-error-handler/sentry-error-handler'
import { WalletStorageKey, WalletStorageService } from '../storage/storage'
import { WalletconnectService } from '../walletconnect/walletconnect.service'

import { AddressHandler } from './custom-handlers/address-handler'
import { BeaconHandler } from './custom-handlers/beacon-handler'
import { WalletConnectHandler } from './custom-handlers/walletconnect-handler'
import { transportToInteractionSetting } from 'src/app/models/AirGapMarketWalletGroup'
import { KeyShareSync, Uint8PublicKeyShare } from 'src/app/types/KeyShareSync'
import { DecryptionPostBody, DecryptionSync } from 'src/app/types/DecryptionPostBody'

@Injectable({
  providedIn: 'root'
})
export class IACService extends BaseIACService {
  constructor(
    uiEventElementsService: UiEventElementsService,
    public beaconService: BeaconService,
    public readonly deeplinkService: DeeplinkService,
    accountProvider: AccountProvider,
    public walletConnectService: WalletconnectService,
    private readonly dataService: DataService,
    protected readonly clipboard: ClipboardService,
    private readonly protocolService: ProtocolService,
    private readonly storageService: WalletStorageService,
    private readonly priceService: PriceService,
    private readonly router: Router,
    @Inject(APP_CONFIG) appConfig: AppConfig
  ) {
    super(
      uiEventElementsService,
      clipboard,
      Promise.resolve(),
      [
        new BeaconHandler(beaconService),
        new WalletConnectHandler(walletConnectService),
        new AddressHandler(accountProvider, dataService, router) // Address handler is flexible because of regex, so it should be last.
      ],
      deeplinkService,
      appConfig
    )

    this.serializerMessageHandlers[IACMessageType.AccountShareResponse as any] = this.handleWalletSync.bind(this)
    this.serializerMessageHandlers[IACMessageType.TransactionSignResponse as any] = this.handleSignedTransaction.bind(this)
    this.serializerMessageHandlers[IACMessageType.MessageSignResponse as any] = this.handleMessageSignResponse.bind(this)
  }

  public async relay(data: RelayMessage): Promise<void> {
    const info = {
      data: (data as any).messages, // TODO: Fix types
      isRelay: true
    }
    this.dataService.setData(DataServiceKey.INTERACTION, info)
    this.router.navigateByUrl('/interaction-selection/' + DataServiceKey.INTERACTION).catch(handleErrorSentry(ErrorCategory.NAVIGATION))
  }

  public async handleWalletSync(deserializedSyncs: IACMessageDefinitionObject[], transport: IACMessageTransport): Promise<boolean> {
    this.storageService.set(WalletStorageKey.DEEP_LINK, true).catch(handleErrorSentry(ErrorCategory.STORAGE))

    const accountSyncs: AccountSync[] = await Promise.all(
      deserializedSyncs.map(async (deserializedSync: IACMessageDefinitionObject) => {
        const accountShare: AccountShareResponse = deserializedSync.payload as AccountShareResponse
        const protocol = await this.protocolService.getProtocol(deserializedSync.protocol)
        const wallet: AirGapMarketWallet = new AirGapMarketWallet(
          protocol,
          accountShare.publicKey,
          accountShare.isExtendedPublicKey,
          accountShare.derivationPath,
          accountShare.masterFingerprint || /* backwards compatibility */ '',
          accountShare.isActive === undefined
            ? /* backwards compatibility */ AirGapWalletStatus.ACTIVE
            : accountShare.isActive
            ? AirGapWalletStatus.ACTIVE
            : AirGapWalletStatus.HIDDEN,
          this.priceService
        )

        return {
          wallet,
          groupId: accountShare.groupId,
          groupLabel: accountShare.groupLabel,
          interactionSetting: transportToInteractionSetting(transport)
        }
      })
    )

    if (this.router) {
      this.dataService.setData(DataServiceKey.SYNC_ACCOUNTS, accountSyncs)
      this.router.navigateByUrl(`/account-import/${DataServiceKey.SYNC_ACCOUNTS}`).catch(handleErrorSentry(ErrorCategory.NAVIGATION))

      return true
    }

    return false
  }

  public async handleSignedTransaction(messageDefinitionObjects: IACMessageDefinitionObject[]): Promise<boolean> {
    if (this.router) {
      const info = {
        messageDefinitionObjects: messageDefinitionObjects
      }
      this.dataService.setData(DataServiceKey.TRANSACTION, info)
      this.router.navigateByUrl(`/transaction-confirm/${DataServiceKey.TRANSACTION}`).catch(handleErrorSentry(ErrorCategory.NAVIGATION))

      return true
    }

    return false
  }

  private async handleMessageSignResponse(
    deserializedMessages: IACMessageDefinitionObject[],
    transport: IACMessageTransport
  ): Promise<boolean> {
    if (deserializedMessages[0].protocol === 'xtz') {
      // Public Key Share
      if (this.router) {
        const keyShare: Uint8PublicKeyShare = JSON.parse((deserializedMessages[0].payload as any).message)

        this.storageService.set(WalletStorageKey.DEEP_LINK, true).catch(handleErrorSentry(ErrorCategory.STORAGE))

        const keyShareSync: KeyShareSync = {
          keyShare,
          interactionSetting: transportToInteractionSetting(transport)
        }

        this.dataService.setData(DataServiceKey.SYNC_KEYSHARE, [keyShareSync])
        this.router.navigateByUrl(`/keyshare-import/${DataServiceKey.SYNC_KEYSHARE}`).catch(handleErrorSentry(ErrorCategory.NAVIGATION))

        return true
      }
    } else {
      // Decrypted Votes
      if (this.router) {
        const decryptionPostBody: DecryptionPostBody = JSON.parse((deserializedMessages[0].payload as any).message)

        this.storageService.set(WalletStorageKey.DEEP_LINK, true).catch(handleErrorSentry(ErrorCategory.STORAGE))

        const decryptionSync: DecryptionSync = {
          decryptionPostBody,
          interactionSetting: transportToInteractionSetting(transport)
        }

        this.dataService.setData(DataServiceKey.SYNC_DECRYPTION, [decryptionSync])
        this.router.navigateByUrl(`/decryption-import/${DataServiceKey.SYNC_DECRYPTION}`).catch(handleErrorSentry(ErrorCategory.NAVIGATION))

        return true
      }
    }

    return false
  }
}
