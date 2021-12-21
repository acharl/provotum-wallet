import { flattened } from '@airgap/angular-core'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, NavController, Platform } from '@ionic/angular'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DataService } from 'src/app/services/data/data.service'
import { ErrorCategory, handleErrorSentry } from 'src/app/services/sentry-error-handler/sentry-error-handler'
import { DecryptionSync } from 'src/app/types/DecryptionPostBody'

interface DecryptionImport extends DecryptionSync {
  alreadyExists: boolean
}
@Component({
  selector: 'app-decryption-import',
  templateUrl: './decryption-import.page.html',
  styleUrls: ['./decryption-import.page.scss']
})
export class DecryptionImportPage {
  public decryptionSync: DecryptionSync
  public decryptionImports: Map<string | undefined, DecryptionImport[]> = new Map()
  private get allDecryptionImports(): DecryptionImport[] {
    return flattened(Array.from(this.decryptionImports.values()))
  }

  public loading: HTMLIonLoadingElement

  private readonly ngDestroyed$: Subject<void> = new Subject()

  constructor(
    private readonly platform: Platform,
    private readonly loadingCtrl: LoadingController,
    private readonly navController: NavController,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dataService: DataService // private readonly ngZone: NgZone
  ) {}

  public async ionViewWillEnter(): Promise<void> {
    this.loading = await this.loadingCtrl.create({
      message: 'Syncing...',
      backdropDismiss: true
    })
    this.decryptionImports.clear()
    if (this.route.snapshot.data.special) {
      this.dataService
        .getDecryptionSyncs()
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe((decryptionSyncs: DecryptionSync[]) => {
          console.log('decryptionSync', decryptionSyncs)

          decryptionSyncs.forEach((decryptionSync: DecryptionSync) => {
            const challenge: string | undefined = decryptionSync.decryptionPostBody.decryption_proof.challenge
            if (!this.decryptionImports.has(challenge)) {
              this.decryptionImports.set(challenge, [])
            }
            this.decryptionImports.get(challenge).push({
              ...decryptionSync,
              alreadyExists: false
            })
          })
        })
    }

    await this.platform.ready()

    this.loading.present().catch(handleErrorSentry(ErrorCategory.NAVIGATION))
  }

  public async ionViewDidEnter(): Promise<void> {
    this.allDecryptionImports.forEach((decryptionImport: DecryptionImport) => {
      decryptionImport.alreadyExists = false //this.accountProvider.walletExists(decryptionImport.wallet)

      this.loading.dismiss().catch(handleErrorSentry(ErrorCategory.NAVIGATION))
    })
  }

  public ngOnDestroy(): void {
    this.ngDestroyed$.next()
    this.ngDestroyed$.complete()
  }

  public async dismiss(): Promise<void> {
    this.navController.back()
  }

  public async import(): Promise<void> {
    console.log('HARIBOL')
    // const addKeyShareInfos = this.allDecryptionImports.map((decryptionImport: DecryptionImport) => {
    //   return {
    //     keyShare: decryptionImport.keyShare,
    //     interactionSetting: decryptionImport.interactionSetting,
    //     options: { override: true }
    //   }
    // })

    // await this.keyShareService.addKeyShares(addKeyShareInfos)
    // // addKeyShareInfos.forEach((addKeyShareInfo) => {
    // //   this.keyShareService.setInteractionSettingForWalletGroupByWallet(addKeyShareInfo.keyShare, addKeyShareInfo.interactionSetting)
    // // })

    await this.router.navigateByUrl('/tabs/portfolio')
  }
}
