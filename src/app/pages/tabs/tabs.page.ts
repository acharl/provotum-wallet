import { Component } from '@angular/core'
import { IonTabs, ModalController, Platform } from '@ionic/angular'
import { PortfolioPage } from '../portfolio/portfolio'
import { ScanPage } from '../scan/scan'
import { SettingsPage } from '../settings/settings'
import { SyncPage } from '../sync/sync.page'

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  private activeTab?: HTMLElement

  public tab1Root = PortfolioPage
  public tab2Root = SyncPage
  public tab3Root = ScanPage
  public tab4Root = SettingsPage

  public isMobile = false

  constructor(public modalController: ModalController, private readonly platform: Platform) {
    this.isMobile = this.platform.is('android') || this.platform.is('ios')
  }

  tabChange(tabsRef: IonTabs) {
    this.activeTab = tabsRef.outlet.activatedView.element
  }

  ionViewWillEnter() {
    this.propagateToActiveTab('ionViewWillEnter')
  }

  private propagateToActiveTab(eventName: string) {
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName))
    }
  }
}
