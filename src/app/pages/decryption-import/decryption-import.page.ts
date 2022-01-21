import { flattened } from '@airgap/angular-core'
import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular'
import { BehaviorSubject, Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { ApiService } from 'src/app/services/api/api.service'
import { DataService } from 'src/app/services/data/data.service'
import { ErrorCategory, handleErrorSentry } from 'src/app/services/sentry-error-handler/sentry-error-handler'
import { DecryptionSync } from 'src/app/types/DecryptionPostBody'
import Swal from 'sweetalert2'

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
  public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public loading: HTMLIonLoadingElement

  private readonly ngDestroyed$: Subject<void> = new Subject()

  constructor(
    private readonly platform: Platform,
    private readonly loadingCtrl: LoadingController,
    private readonly navController: NavController,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alertController: AlertController,
    private readonly dataService: DataService, // private readonly ngZone: NgZone
    private readonly apiService: ApiService
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
          this.decryptionSync = decryptionSyncs[0]
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

  async broadcast(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Prompt!', // TODO JGD change this
      message: 'Please enter the Vote ID and the Question for which you want to publish a partial decryption result',
      inputs: [
        {
          name: 'vote',
          type: 'text',
          placeholder: 'Vote ID'
        },
        {
          name: 'question',
          type: 'text',
          placeholder: 'Question'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel')
          }
        },
        {
          text: 'Ok',
          handler: async (data) => {
            this.busy$.next(true)

            this.apiService
              .postDecryptionResult(this.decryptionSync.decryptionPostBody, data.vote, data.question)
              .then((result) => {
                this.busy$.next(false)
                this.showSweetAlert(result.data)

                this.router.navigateByUrl('/tabs/portfolio')
              })
              .catch(() => {
                this.busy$.next(false)
                this.router.navigateByUrl('/tabs/portfolio')
              })
          }
        }
      ]
    })

    await alert.present()
  }

  private async showSweetAlert(message: string): Promise<void> {
    Swal.fire({
      title: 'Success',
      text: `${message}`,
      icon: 'success'
    })
  }
}
