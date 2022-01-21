import { Injectable } from '@angular/core'
import { Cipher } from 'src/app/types/Cipher'
import { SealerDecryptionPostBody } from 'src/app/types/DecryptionPostBody'
import { Uint8PublicKeyShareSync } from 'src/app/types/KeyShareSync'
import axios from '../../../../node_modules/axios'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseURL: string = 'https://calm-wildwood-85369.herokuapp.com/https://9d33-46-101-241-92.ngrok.io'

  constructor() {}

  async postKeygen(keyShare: Uint8PublicKeyShareSync, vote: string) {
    const body = JSON.stringify({
      pk: keyShare.pk,
      proof: keyShare.proof
    })
    return axios.post(`${this.baseURL}/keygen/${vote}/${keyShare.sealer}`, body, {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  async getEncryptedCiphers(vote: string, question: string): Promise<Cipher[]> {
    const { data } = await axios.get(`${this.baseURL}/decrypt/${vote}/${question}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    return data
  }

  async postDecryptionResult(decryption: SealerDecryptionPostBody, vote: string, question: string) {
    console.log('postDecryptionResult', decryption)
    const body = JSON.stringify({
      decryption_proof: decryption.decryption_proof,
      shares: decryption.shares
    })
    return axios.post(`${this.baseURL}/decrypt/${vote}/${question}/${decryption.sealer}`, body, {
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
