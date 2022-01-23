import { IACMessageDefinitionObjectV3, IACMessageType, MainProtocolSymbols, MessageSignRequest } from '@airgap/coinlib-core'
import { Component } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { BehaviorSubject } from 'rxjs'
import { ApiService } from 'src/app/services/api/api.service'
import { InteractionService } from 'src/app/services/interaction/interaction.service'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss']
})
export class SyncPage {
  public busy$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(
    private readonly apiService: ApiService,
    private readonly interactionService: InteractionService,
    private readonly alertController: AlertController
  ) {}
  async fetchEncryptedCiphers() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Prompt!',
      message: 'Please enter the Vote ID as well as the Question for which you want to fetch the encrypted votes',
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

            const encryptedCiphers = await this.apiService.getEncryptedCiphers(data.vote, data.question)

            const messageSignRequest: MessageSignRequest = {
              message: JSON.stringify(encryptedCiphers),
              publicKey: '',
              callbackURL: ''
            }

            const signRequestObject: IACMessageDefinitionObjectV3 = {
              id: 12345678,
              type: IACMessageType.MessageSignRequest,
              protocol: MainProtocolSymbols.ETH,
              payload: messageSignRequest
            }

            this.interactionService
              .offlineDeviceSign([signRequestObject])
              .then(() => this.busy$.next(false))
              .catch((err) => {
                this.showError(err)
                this.busy$.next(false)
              })
          }
        }
      ]
    })

    await alert.present()
  }
  private async showError(message: string): Promise<void> {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: `${message}`
    })
  }

  public ngOnDestroy(): void {
    this.busy$.next(false)
  }
}
