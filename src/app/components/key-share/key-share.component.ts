import { Component, Input } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { BehaviorSubject } from 'rxjs'
import { ApiService } from 'src/app/services/api/api.service'
import { Uint8PublicKeyShareSync } from 'src/app/types/KeyShareSync'
// import Swal from 'sweetalert2'

@Component({
  selector: 'app-key-share',
  templateUrl: './key-share.component.html',
  styleUrls: ['./key-share.component.scss']
})
export class KeyShareComponent {
  // _keyShare: SealerPublicKeyShare
  public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private readonly apiService: ApiService, private readonly alertController: AlertController) {}
  @Input()
  keyShare: Uint8PublicKeyShareSync

  async sync() {
    this.busy$.next(true)
    // let keyShare = { pk: [], proof: { challenge: [], response: [] } }
    // keyShare.pk = Array.from(Uint8Array.from(Buffer.from(this._keyShare.pk, 'hex')))
    // keyShare.proof.challenge = Array.from(Uint8Array.from(Buffer.from(this._keyShare.proof.challenge, 'hex')))
    // keyShare.proof.response = Array.from(Uint8Array.from(Buffer.from(this._keyShare.proof.response, 'hex')))

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Prompt!',
      message: 'Please enter the Vote ID as well as your Sealer ID to broadcast the public key share',
      inputs: [
        {
          name: 'vote',
          type: 'text',
          placeholder: 'Vote ID'
        },
        {
          name: 'sealer',
          type: 'text',
          placeholder: 'Sealer'
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
            this.apiService
              .postKeygen(
                { pk: this.keyShare.pk, proof: { challenge: this.keyShare.proof.challenge, response: this.keyShare.proof.response } },
                data.vote,
                data.sealer
              )
              .then((result) => {
                this.busy$.next(false)
                this.showSweetAlert(result.data)
              })
              .catch(() => this.busy$.next(false))
          }
        }
      ]
    })

    await alert.present()
  }

  private async showSweetAlert(_message: string): Promise<void> {
    // Swal.fire({
    //   title: 'Success',
    //   text: `${message}`,
    //   icon: 'success'
    // })
  }
}
