import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { SyncPage } from './sync.page'
import { ComponentsModule } from '@airgap/angular-core'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, ComponentsModule, RouterModule.forChild([{ path: '', component: SyncPage }])],
  declarations: [SyncPage]
})
export class SyncPageModule {}
