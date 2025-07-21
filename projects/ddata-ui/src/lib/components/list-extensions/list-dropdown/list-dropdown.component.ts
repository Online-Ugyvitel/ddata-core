// tslint:disable: max-line-length
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CertificateIncomingGuaranteeCreateEditComponent } from 'src/app/components/certificate/incoming/guarantee/certificate-incoming-guarantee-create-edit/certificate-incoming-guarantee-create-edit.component';
import { CertificateOutgoingGuaranteeCreateEditComponent } from 'src/app/components/certificate/outgoing/guarantee/certificate-outgoing-guarantee-create-edit/certificate-guarantee-create-edit.component';
import { ID } from 'src/app/models/base-model/base-data-type.model';
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
import { DialogContentItem } from 'src/app/models/dialog/content/dialog-content-item';
import { Global } from 'src/app/models/global.model';
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
  standalone: false
})
export class ListDropdownComponent implements OnInit {
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
  @Output() showModal: EventEmitter<DialogContentItem> = new EventEmitter();
  @Output() customDropdownEvent: EventEmitter<string> = new EventEmitter();

  icon = new Global().icon;

  constructor() {}

  ngOnInit(): void {}

  /**
   * A paraméterben megadott bizonylatból hozzon létre egy új példányt a sorban lévő partner adataival
   * @param id convert ot this certification_type_id
   */
  createCertificate(id: number) {
    if (!!this.company && !!this.company.id) {
      // bejövő bizonylatok esetén a seller_company-nak, kimenő esetén a buyer_company-nak adja át a kiválasztott partnert
      const data =
        id === 4 || id === 8 || id === 19
          ? {
              seller_company_id: this.company.id,
              seller_company: new Company().init(this.company)
            }
          : {
              buyer_company_id: this.company.id,
              buyer_company: new Company().init(this.company)
            };
      let newCertificate: CertificationInterface;

      switch (id) {
        case 2:
          newCertificate = new CertificationCommercialTakebackOne().init(data);
          this.showModal.emit(
            new DialogContentItem(
              CertificationCommercialTakebackOneCreateEditComponent,
              newCertificate
            )
          );
          break;
        case 3:
          newCertificate = new CertificationCommercialStockUpload().init(data);
          this.showModal.emit(
            new DialogContentItem(
              CertificationCommercialStockUploadCreateEditComponent,
              newCertificate
            )
          );
          break;
        case 5:
          newCertificate = new CertificationCommercialWeightLoss().init(data);
          this.showModal.emit(
            new DialogContentItem(
              CertificateCommercialWeightLossCreateEditComponent,
              newCertificate
            )
          );
          break;
        case 6:
          newCertificate = new CertificationCustomerOrder().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateCustomerOrderCreateEditComponent, newCertificate)
          );
          break;
        case 7:
          newCertificate = new CertificationIncomingDeliveryNote().init(data);
          this.showModal.emit(
            new DialogContentItem(
              CertificateIncomingDeliveryNoteCreateEditComponent,
              newCertificate
            )
          );
          break;
        case 8:
          newCertificate = new CertificationIncomingGuarantee().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateIncomingGuaranteeCreateEditComponent, newCertificate)
          );
          break;
        case 9:
          newCertificate = new CertificationIncomingInvoice().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateIncomingInvoiceCreateEditComponent, newCertificate)
          );
          break;
        case 10:
          newCertificate = new CertificationInventoryControl().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateInventoryControlCreateEditComponent, newCertificate)
          );
          break;
        case 11:
          console.log('Model hiba');
          // newCertificate = new CertificationMovementBetweenWarehouses().init(data);
          // this.showModal.emit( new DialogContentItem(MovementBetweenWarehousesCreateEditComponent, newCertificate));
          break;
        case 12:
          newCertificate = new CertificationOutgoingDeliveryNote().init(data);
          this.showModal.emit(
            new DialogContentItem(
              CertificateOutgoingDeliveryNoteCreateEditComponent,
              newCertificate
            )
          );
          break;
        case 13:
          newCertificate = new CertificationOutgoingGuarantee().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateOutgoingGuaranteeCreateEditComponent, newCertificate)
          );
          break;
        case 14:
          newCertificate = new CertificationOutgoingInvoice().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateOutgoingInvoiceCreateEditComponent, newCertificate)
          );
          break;
        case 17:
          console.log('Model hiba');
          // newCertificate = new CertificationProductExplodeNote().init(data);
          // this.showModal.emit( new DialogContentItem(CertificateProductExplodeNoteCreateEditComponent, newCertificate));
          break;
        case 18:
          console.log('Model hiba');
          // newCertificate = new CertificationProductImplodeNote().init(data);
          // this.showModal.emit( new DialogContentItem(CertificateProductImplodeNoteCreateEditComponent, newCertificate));
          break;
        case 19:
          newCertificate = new CertificationReturnedFromCustomer().init(data);
          this.showModal.emit(
            new DialogContentItem(
              CertificationReturnedFromCustomerCreateEditComponent,
              newCertificate
            )
          );
          break;
        case 20:
          newCertificate = new CertificationReturnedToProducer().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateReturnToProducerCreateEditComponent, newCertificate)
          );
          break;
        case 21:
          newCertificate = new CertificationScrappingProtocol().init(data);
          this.showModal.emit(
            new DialogContentItem(CertificateScrappingProtocolCreateEditComponent, newCertificate)
          );
          break;

        default:
          console.error('Certificate_id (', id, ') is not valid.');
      }
    } else {
      console.error('Missing company data.');
    }
  }

  isShowElement(id: number) {
    // a Bizományos visszavétel csak akkor látszódjon, ha a bolt bizományos bolt
    if (id === 4) {
      return !!this.companyShop && this.companyShop.is_commercial_warehouse;
    }

    return true;
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
