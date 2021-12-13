import { Injectable } from '@angular/core'
import { Uint8PublicKeyShare } from 'src/app/types/KeyShareSync'
import axios from '../../../../node_modules/axios'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseURL: string = 'https://calm-wildwood-85369.herokuapp.com/https://6b3a-46-101-241-92.ngrok.io'

  constructor() {}

  async postKeygen(keyShare: Uint8PublicKeyShare, vote: string = 'Vote5', sealer: string = 'bob') {
    const body = JSON.stringify({
      pk: keyShare.pk,
      proof: keyShare.proof
    })
    return axios.post(`${this.baseURL}/keygen/${vote}/${sealer}`, body, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
