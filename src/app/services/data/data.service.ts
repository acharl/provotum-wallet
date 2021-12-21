import { Injectable } from '@angular/core'
import { WalletStorageService } from '../storage/storage'
import { BehaviorSubject, Observable } from 'rxjs'
import { AccountSync } from 'src/app/types/AccountSync'
import { KeyShareSync } from 'src/app/types/KeyShareSync'
import { DecryptionSync } from 'src/app/types/DecryptionPostBody'

export enum DataServiceKey {
  SYNC_ACCOUNTS = 'sync-accounts',
  SYNC_KEYSHARE = 'sync-keyshare',
  SYNC_DECRYPTION = 'sync-decryption',
  ACCOUNTS = 'accounts',
  PROTOCOL = 'protocol',
  DETAIL = 'detail',
  INTERACTION = 'interaction',
  EXCHANGE = 'exchange',
  TRANSACTION = 'transaction',
  SCAN = 'scan',
  WALLET = 'wallet'
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly data = []
  private accountSyncs$: BehaviorSubject<AccountSync[] | null> = new BehaviorSubject(null)
  private keyShareSyncs$: BehaviorSubject<KeyShareSync[] | null> = new BehaviorSubject(null)
  private decryptionSyncs$: BehaviorSubject<DecryptionSync[] | null> = new BehaviorSubject(null)

  constructor(private readonly storage: WalletStorageService) {}

  public getAccountSyncs(): Observable<AccountSync[] | null> {
    return this.accountSyncs$.asObservable()
  }

  public getKeyShareSyncs(): Observable<KeyShareSync[] | null> {
    return this.keyShareSyncs$.asObservable()
  }

  public getDecryptionSyncs(): Observable<DecryptionSync[] | null> {
    return this.decryptionSyncs$.asObservable()
  }

  public setData(id, data) {
    if (id === DataServiceKey.SYNC_ACCOUNTS) {
      this.accountSyncs$.next(data)
    }
    if (id === DataServiceKey.SYNC_KEYSHARE) {
      this.keyShareSyncs$.next(data)
    }
    if (id === DataServiceKey.SYNC_DECRYPTION) {
      this.decryptionSyncs$.next(data)
    }
    this.data[id] = data
  }

  public getData(id) {
    return this.data[id]
  }

  public async get<K extends DataServiceKey>(key: K): Promise<any> {
    return this.storage.getCache(key)
  }

  public async set<K extends DataServiceKey>(key: K, value: any): Promise<any> {
    return this.storage.setCache(key, value)
  }
}
