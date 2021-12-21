import { flattened } from '@airgap/angular-core'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { LoadingController, NavController, Platform } from '@ionic/angular'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DataService } from 'src/app/services/data/data.service'
import { KeyShareService } from 'src/app/services/key-share/key-share.service'
import { ErrorCategory, handleErrorSentry } from 'src/app/services/sentry-error-handler/sentry-error-handler'
import { KeyShareSync } from 'src/app/types/KeyShareSync'

interface KeyShareImport extends KeyShareSync {
  alreadyExists: boolean
}
@Component({
  selector: 'app-key-share-import',
  templateUrl: './key-share-import.page.html',
  styleUrls: ['./key-share-import.page.scss']
})
export class KeyShareImportPage {
  public keyShareSync: KeyShareSync
  public keyShareImports: Map<string | undefined, KeyShareImport[]> = new Map()
  private get allKeyShareImports(): KeyShareImport[] {
    return flattened(Array.from(this.keyShareImports.values()))
  }

  public loading: HTMLIonLoadingElement

  private readonly ngDestroyed$: Subject<void> = new Subject()

  constructor(
    private readonly platform: Platform,
    private readonly loadingCtrl: LoadingController,
    private readonly navController: NavController,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly keyShareService: KeyShareService,
    private readonly dataService: DataService // private readonly ngZone: NgZone
  ) {}

  public async ionViewWillEnter(): Promise<void> {
    this.loading = await this.loadingCtrl.create({
      message: 'Syncing...',
      backdropDismiss: true
    })
    this.keyShareImports.clear()
    if (this.route.snapshot.data.special) {
      this.dataService
        .getKeyShareSyncs()
        .pipe(takeUntil(this.ngDestroyed$))
        .subscribe((keyShareSyncs: KeyShareSync[]) => {
          keyShareSyncs.forEach((keyShareSync: KeyShareSync) => {
            console.log('keyShareSync', keyShareSync)

            const pk: string | undefined = keyShareSync.keyShare.pk.toString()
            if (!this.keyShareImports.has(pk)) {
              this.keyShareImports.set(pk, [])
            }
            this.keyShareImports.get(pk).push({
              ...keyShareSync,
              alreadyExists: false
            })
          })
        })
    }

    await this.platform.ready()

    this.loading.present().catch(handleErrorSentry(ErrorCategory.NAVIGATION))
  }

  public async ionViewDidEnter(): Promise<void> {
    this.allKeyShareImports.forEach((keyShareImport: KeyShareImport) => {
      keyShareImport.alreadyExists = false //this.accountProvider.walletExists(keyShareImport.wallet)

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
    const addKeyShareInfos = this.allKeyShareImports.map((keyShareImport: KeyShareImport) => {
      return {
        keyShare: keyShareImport.keyShare,
        interactionSetting: keyShareImport.interactionSetting,
        options: { override: true }
      }
    })

    await this.keyShareService.addKeyShares(addKeyShareInfos)
    // addKeyShareInfos.forEach((addKeyShareInfo) => {
    //   this.keyShareService.setInteractionSettingForWalletGroupByWallet(addKeyShareInfo.keyShare, addKeyShareInfo.interactionSetting)
    // })

    await this.router.navigateByUrl('/tabs/portfolio')
  }
}
