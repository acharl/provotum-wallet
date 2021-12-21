import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { DecryptionImportPage } from './decryption-import.page'
import { ComponentsModule } from '@airgap/angular-core'
import { TranslateModule } from '@ngx-translate/core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ComponentsModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: DecryptionImportPage }])
  ],
  declarations: [DecryptionImportPage]
})
export class DecryptionImportPageModule {}
