// tslint:disable: max-line-length
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CertificateIncomingGuaranteeCreateEditComponent } from 'src/app/components/certificate/incoming/guarantee/certificate-incoming-guarantee-create-edit/certificate-incoming-guarantee-create-edit.component';
import { CertificateOutgoingGuaranteeCreateEditComponent } from 'src/app/components/certificate/outgoing/guarantee/certificate-outgoing-guarantee-create-edit/certificate-guarantee-create-edit.component';
import { CertificationInterface } from 'src/app/models/certification/certification.interface';
import { CertificationCommercialStockUpload } from 'src/app/models/certification/commercial/stock/upload/certification-commercial-stock-upload.model';
import { CertificationCommercialTakebackOne } from 'src/app/models/certification/commercial/takeback/one/certification-commercial-takeback-one.model';
import { CertificationCommercialWeightLoss } from 'src/app/models/certification/commercial/weight/loss/certification-commercial-weight-loss.model';
import { CertificationCustomerOrder } from 'src/app/models/certification/customer/order/certification-customer-order.model';
import { CertificationIncomingDeliveryNote } from 'src/app/models/certification/incoming/delivery/note/certification-incoming-delivery-note.model';
import { CertificationIncomingGuarantee } from 'src/app/models/certification/incoming/guarantee/certification-incoming-guarantee.model';
import { CertificationIncomingInvoice } from 'src/app/models/certification/incoming/invoice/certification-incoming-invoice.model';
import { CertificationInventoryControl } from 'src/app/models/certification/inventory/control/certification-inventory-control.model';
import { CertificationOutgoingDeliveryNote } from 'src/app/models/certification/outgoing/delivery/note/certification-outgoing-delivery-note.model';
import { CertificationOutgoingGuarantee } from 'src/app/models/certification/outgoing/guarantee/certification-outgoing-guarantee.model';
import { CertificationOutgoingInvoice } from 'src/app/models/certification/outgoing/invoice/certification-outgoing-invoice.model';
import { CertificationReturnedFromCustomer } from 'src/app/models/certification/returned/from/customer/certification-returned-from-customer.model';
import { CertificationReturnedToProducer } from 'src/app/models/certification/returned/to/producer/certification-returned-to-producer.model';
import { CertificationScrappingProtocol } from 'src/app/models/certification/scrapping/protocol/certification-scrapping-protocol.model';
import { CertificationTypeInterface } from 'src/app/models/certification/type/certification-type.interface';
import { CompanyInterface } from 'src/app/models/company/company.interface';
import { CompanyShopInterface } from 'src/app/models/company/shop/company-shop.interface';
import { DialogContentItem } from 'ddata-ui-dialog';
import { Global } from '../../../models/global.model';
import { ListDropdownItemInterface } from 'src/app/models/list-dropdown-item/list-dropdown-item.interface';
import { CertificationCommercialStockUploadCreateEditComponent } from 'src/app/modules/sales/components/commercial/stock/upload/certification-commercial-stock-upload-create-edit/certification-commercial-stock-upload-create-edit.component';
import { CertificationCommercialTakebackOneCreateEditComponent } from 'src/app/modules/sales/components/commercial/takeback/one/certification-commercial-takeback-one-create-edit/certification-commercial-takeback-one.component';
import { CertificateCommercialWeightLossCreateEditComponent } from 'src/app/modules/sales/components/commercial/weight/loss/certificate-commercial-weight-loss-create-edit/certificate-commercial-weight-loss.component';
import { CertificateCustomerOrderCreateEditComponent } from 'src/app/modules/sales/components/customer/order/certificate-customer-order-create-edit/certificate-customer-order-create-edit.component';
import { CertificateOutgoingDeliveryNoteCreateEditComponent } from 'src/app/modules/sales/components/outgoing/delivery/note/certificate-delivery-note-create-edit/certificate-delivery-note-create-edit.component';
import { CertificateOutgoingInvoiceCreateEditComponent } from 'src/app/modules/sales/components/outgoing/invoice/certificate-outgoing-invoice-create-edit/certificate-outgoing-invoice-create-edit.component';
import { CertificationReturnedFromCustomerCreateEditComponent } from 'src/app/modules/sales/components/returned/from/customer/certification-returned-from-customer-create-edit/certification-returned-from-customer-create-edit.component';
import { CertificateIncomingDeliveryNoteCreateEditComponent } from 'src/app/modules/supply/components/incoming/delivery/note/certificate-incoming-delivery-note-create-edit/certificate-incoming-delivery-note-create-edit.component';
import { CertificateIncomingInvoiceCreateEditComponent } from 'src/app/modules/supply/components/incoming/invoice/certificate-incoming-invoice-create-edit/certificate-incoming-invoice-create-edit.component';
import { CertificateReturnToProducerCreateEditComponent } from 'src/app/modules/supply/components/returned/to/producer/certificate-returned-to-producer-create-edit/certificate-returned-to-producer-create-edit.component';
import { CertificateInventoryControlCreateEditComponent } from 'src/app/modules/warehouses/components/certification/inventory/control/inventory-control-create-edit/certificate-inventory-control-create-edit.component';
import { CertificateScrappingProtocolCreateEditComponent } from 'src/app/modules/warehouses/components/certification/scrapping/protocol/certificate-scrapping-protocol-create-edit/certificate-scrapping-protocol-create-edit.component';
import { Company } from 'src/app/models/company/company.model';

@Component({
  selector: 'dd-list-dropdown',
  templateUrl: './list-dropdown.component.html',
  styleUrls: ['./list-dropdown.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDropdownComponent {
  @Input() customDropdownItems: Array<ListDropdownItemInterface> = []; // {name: '', icon: '', eventMsg: ''}
  // @Input() showCertificateFromCompany = false;
  @Input() certificationTypes: Array<CertificationTypeInterface> = [];
  @Input() company: CompanyInterface;
  @Input() companyShop: CompanyShopInterface;
  @Input() showDelete = true;
  @Input() editLink = '';
  @Input() showHref = false;
  @Input() href = '';
  @Input() hrefText = '';
  @Output() readonly showModal: EventEmitter<DialogContentItem> = new EventEmitter();
  @Output() readonly customDropdownEvent: EventEmitter<string> = new EventEmitter();

  icon = new Global().icon;

  constructor() {}

  // ngOnInit(): void {} // Empty lifecycle method removed

  /**
   * A paraméterben megadott bizonylatból hozzon létre egy új példányt a sorban lévő partner adataival
   * @param id convert ot this certification_type_id
   */
  createCertificate(id: number): void {
    if (!this.company || !this.company.id) {
      throw new Error('Missing company data.');
    }
    const data = this.getCompanyData(id);
    const newCertificate = this.createCertificateByType(id, data);

    if (newCertificate) {
      this.emitCertificateModal(id, newCertificate);
    }
  }

  isShowElement(id: number): boolean {
    // a Bizományos visszavétel csak akkor látszódjon, ha a bolt bizományos bolt
    if (id === 4) {
      return !!this.companyShop && this.companyShop.is_commercial_warehouse;
    }

    return true;
  }

  private getCompanyData(id: number): object {
    const isIncomingCertificate = id === 4 || id === 8 || id === 19;

    return isIncomingCertificate
      ? {
          seller_company_id: this.company.id,
          seller_company: new Company().init(this.company)
        }
      : {
          buyer_company_id: this.company.id,
          buyer_company: new Company().init(this.company)
        };
  }

  private createCertificateByType(id: number, data: object): CertificationInterface | null {
    switch (id) {
      case 2:
        return new CertificationCommercialTakebackOne().init(data);
      case 3:
        return new CertificationCommercialStockUpload().init(data);
      case 5:
        return new CertificationCommercialWeightLoss().init(data);
      case 6:
        return new CertificationCustomerOrder().init(data);
      case 7:
        return new CertificationIncomingDeliveryNote().init(data);
      case 8:
        return new CertificationIncomingGuarantee().init(data);
      case 9:
        return new CertificationIncomingInvoice().init(data);
      case 10:
        return new CertificationInventoryControl().init(data);
      case 12:
        return new CertificationOutgoingDeliveryNote().init(data);
      case 13:
        return new CertificationOutgoingGuarantee().init(data);
      case 14:
        return new CertificationOutgoingInvoice().init(data);
      case 19:
        return new CertificationReturnedFromCustomer().init(data);
      case 20:
        return new CertificationReturnedToProducer().init(data);
      case 21:
        return new CertificationScrappingProtocol().init(data);
      case 11:
      case 17:
      case 18:
        // Note: Model error - implementation needed
        return null;
      default:
        throw new Error(`Certificate_id (${id}) is not valid.`);
    }
  }

  private emitCertificateModal(id: number, certificate: CertificationInterface): void {
    const componentMap = this.getComponentMap();
    const component = componentMap[id];

    if (component) {
      this.showModal.emit(new DialogContentItem(component, certificate));
    }
  }

  private getComponentMap(): { [key: number]: unknown } {
    return {
      2: CertificationCommercialTakebackOneCreateEditComponent,
      3: CertificationCommercialStockUploadCreateEditComponent,
      5: CertificateCommercialWeightLossCreateEditComponent,
      6: CertificateCustomerOrderCreateEditComponent,
      7: CertificateIncomingDeliveryNoteCreateEditComponent,
      8: CertificateIncomingGuaranteeCreateEditComponent,
      9: CertificateIncomingInvoiceCreateEditComponent,
      10: CertificateInventoryControlCreateEditComponent,
      12: CertificateOutgoingDeliveryNoteCreateEditComponent,
      13: CertificateOutgoingGuaranteeCreateEditComponent,
      14: CertificateOutgoingInvoiceCreateEditComponent,
      19: CertificationReturnedFromCustomerCreateEditComponent,
      20: CertificateReturnToProducerCreateEditComponent,
      21: CertificateScrappingProtocolCreateEditComponent
    };
  }
}

//   1, 'Árajánlat' 'bid'
//   2, 'Bizományos visszavétel a vevőtől egyesével' 'commercial-takeback-one'
//   3, 'Bizományos feltöltés' 'commercial-stock-upload'
//   4, 'Bizományos visszavétel' 'commercial-return-of-goods-by-one' --- TÖRÖLVE
//   5, 'Bizományos fogyás' 'commercial-weight-loss'
//   6, 'Vevői megrendelés' 'customer-order'
//   7, 'Bejövő szállítólevél' 'incoming-delivery-note'
//   8, 'Garanciális visszavétel' 'incoming-guarantee'
//   9, 'Bejövő áru számla' 'incoming-invoice'
//   10, 'Leltár ív' 'inventory-control'
//   11, 'Raktárak közötti mozgás' 'movement-between-warehouse'
//   12, 'Kimenő szállítólevél' 'outgoing-delivery-note'
//   13, 'Garanciális kiküldés' 'outgoing-guarantee'
//   14, 'Kimenő számla' 'outgoing-invoice'
//   15, 'Előlegszámla' 'prepayment-invoice'
//   16, 'Díjbekérő' 'prepayment-request'
//   17, 'Szétgyártási bizonylat' 'product-explode-note'
//   18, 'Összeszerelési bizonylat' 'product-implode-note'
//   19, 'Visszáru vevőtől' 'returned-from-customer'
//   20, 'Visszáru a gyártónak' 'returned-to-producer'
//   21, 'Selejtezési jegyzőkönyv' 'scrapping-protocol'
