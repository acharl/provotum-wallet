import { Component, Input } from '@angular/core'
import { ToastController } from '@ionic/angular'
import { BehaviorSubject } from 'rxjs'
import { ApiService } from 'src/app/services/api/api.service'
import { ErrorCategory, handleErrorSentry } from 'src/app/services/sentry-error-handler/sentry-error-handler'
import { PublicKeyShare, Uint8PublicKeyShare } from 'src/app/types/KeyShareSync'

@Component({
  selector: 'app-key-share',
  templateUrl: './key-share.component.html',
  styleUrls: ['./key-share.component.scss']
})
export class KeyShareComponent {
  _keyShare: PublicKeyShare
  public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private readonly apiService: ApiService, private readonly toastController: ToastController) {}
  @Input()
  set keyShare(value: Uint8PublicKeyShare) {
    this._keyShare = value as any
    this._keyShare.pk = Buffer.from(new Uint8Array(value.pk)).toString('hex')
    this._keyShare.proof.challenge = Buffer.from(new Uint8Array(value.proof.challenge)).toString('hex')
    this._keyShare.proof.response = Buffer.from(new Uint8Array(value.proof.response)).toString('hex')
  }

  async sync() {
    this.busy$.next(true)
    let keyShare = { pk: [], proof: { challenge: [], response: [] } }
    keyShare.pk = Array.from(Uint8Array.from(Buffer.from(this._keyShare.pk, 'hex')))
    keyShare.proof.challenge = Array.from(Uint8Array.from(Buffer.from(this._keyShare.proof.challenge, 'hex')))
    keyShare.proof.response = Array.from(Uint8Array.from(Buffer.from(this._keyShare.proof.response, 'hex')))

    this.apiService
      .postKeygen(keyShare)
      .then((result) => {
        this.busy$.next(false)
        this.showToast(result.data)
      })
      .catch(() => this.busy$.next(false))
  }

  private async showToast(message: string): Promise<void> {
    const toast: HTMLIonToastElement = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    })
    toast.present().catch(handleErrorSentry(ErrorCategory.IONIC_TOAST))
  }
}
