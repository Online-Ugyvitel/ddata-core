import { CertificationInterface } from './../../models/certification/certification.interface';
import { DialogContentItem } from './../../models/dialog/content/dialog-content-item';
import { Injector } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { AppModule } from 'src/app/app.module';
import { ID } from 'src/app/models/base-model/base-data-type.model';
import { Company } from './../../models/company/company.model';
import { ListDropdownComponent } from './list-dropdown.component';
import { CertificationCommercialTakebackOneCreateEditComponent } from 'src/app/modules/sales/components/commercial/takeback/one/certification-commercial-takeback-one-create-edit/certification-commercial-takeback-one.component';
import { CertificationCommercialTakebackOne } from 'src/app/models/certification/commercial/takeback/one/certification-commercial-takeback-one.model';
import { CertificationCommercialStockUploadCreateEditComponent } from 'src/app/modules/sales/components/commercial/stock/upload/certification-commercial-stock-upload-create-edit/certification-commercial-stock-upload-create-edit.component';
import { CertificationCommercialStockUpload } from 'src/app/models/certification/commercial/stock/upload/certification-commercial-stock-upload.model';
import { CertificationCommercialWeightLoss } from 'src/app/models/certification/commercial/weight/loss/certification-commercial-weight-loss.model';
import { CertificateCommercialWeightLossCreateEditComponent } from 'src/app/modules/sales/components/commercial/weight/loss/certificate-commercial-weight-loss-create-edit/certificate-commercial-weight-loss.component';
import { CertificationCustomerOrder } from 'src/app/models/certification/customer/order/certification-customer-order.model';
import { CertificateCustomerOrderCreateEditComponent } from 'src/app/modules/sales/components/customer/order/certificate-customer-order-create-edit/certificate-customer-order-create-edit.component';
import { CertificationIncomingDeliveryNote } from 'src/app/models/certification/incoming/delivery/note/certification-incoming-delivery-note.model';
import { CertificateIncomingDeliveryNoteCreateEditComponent } from 'src/app/modules/supply/components/incoming/delivery/note/certificate-incoming-delivery-note-create-edit/certificate-incoming-delivery-note-create-edit.component';
import { CertificationIncomingGuarantee } from 'src/app/models/certification/incoming/guarantee/certification-incoming-guarantee.model';
import { CertificateIncomingGuaranteeCreateEditComponent } from 'src/app/components/certificate/incoming/guarantee/certificate-incoming-guarantee-create-edit/certificate-incoming-guarantee-create-edit.component';
import { CertificationIncomingInvoice } from 'src/app/models/certification/incoming/invoice/certification-incoming-invoice.model';
import { CertificateIncomingInvoiceCreateEditComponent } from 'src/app/modules/supply/components/incoming/invoice/certificate-incoming-invoice-create-edit/certificate-incoming-invoice-create-edit.component';
import { CertificationInventoryControl } from 'src/app/models/certification/inventory/control/certification-inventory-control.model';
import { CertificateInventoryControlCreateEditComponent } from 'src/app/modules/warehouses/components/certification/inventory/control/inventory-control-create-edit/certificate-inventory-control-create-edit.component';
import { CertificationOutgoingDeliveryNote } from 'src/app/models/certification/outgoing/delivery/note/certification-outgoing-delivery-note.model';
import { CertificateOutgoingDeliveryNoteCreateEditComponent } from 'src/app/modules/sales/components/outgoing/delivery/note/certificate-delivery-note-create-edit/certificate-delivery-note-create-edit.component';
import { CertificationOutgoingGuarantee } from 'src/app/models/certification/outgoing/guarantee/certification-outgoing-guarantee.model';
import { CertificateOutgoingGuaranteeCreateEditComponent } from 'src/app/components/certificate/outgoing/guarantee/certificate-outgoing-guarantee-create-edit/certificate-guarantee-create-edit.component';
import { CertificationOutgoingInvoice } from 'src/app/models/certification/outgoing/invoice/certification-outgoing-invoice.model';
import { CertificateOutgoingInvoiceCreateEditComponent } from 'src/app/modules/sales/components/outgoing/invoice/certificate-outgoing-invoice-create-edit/certificate-outgoing-invoice-create-edit.component';
import { CertificationReturnedFromCustomer } from 'src/app/models/certification/returned/from/customer/certification-returned-from-customer.model';
import { CertificationReturnedFromCustomerCreateEditComponent } from 'src/app/modules/sales/components/returned/from/customer/certification-returned-from-customer-create-edit/certification-returned-from-customer-create-edit.component';
import { CertificationReturnedToProducer } from 'src/app/models/certification/returned/to/producer/certification-returned-to-producer.model';
import { CertificateReturnToProducerCreateEditComponent } from 'src/app/modules/supply/components/returned/to/producer/certificate-returned-to-producer-create-edit/certificate-returned-to-producer-create-edit.component';
import { CertificationScrappingProtocol } from 'src/app/models/certification/scrapping/protocol/certification-scrapping-protocol.model';
import { CertificateScrappingProtocolCreateEditComponent } from 'src/app/modules/warehouses/components/certification/scrapping/protocol/certificate-scrapping-protocol-create-edit/certificate-scrapping-protocol-create-edit.component';


xdescribe('ListDropdownComponent', () => {
  let component: ListDropdownComponent;
  let fixture: ComponentFixture<ListDropdownComponent>;

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting(), {
    teardown: { destroyAfterEach: false }
}
    );
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListDropdownComponent],
      providers: [
        Injector,
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    AppModule.InjectorInstance = TestBed;
    fixture = TestBed.createComponent(ListDropdownComponent);
  });

  it('should create', () => {
    component = fixture.nativeElement;
    expect(component).toBeTruthy();
  });

  it('createCertificate() should create certificate', () => {
    component = new ListDropdownComponent();
    spyOn(console, 'error');
    component.createCertificate(1);
    expect(console.error).toHaveBeenCalledWith('Missing company data.');

    component.company = new Company().init();
    component.company.id = 11 as ID;
    let newCertificate: CertificationInterface;

    spyOn(console, 'log');

    component.createCertificate(11);
    fixture.detectChanges();
    expect(console.log).toHaveBeenCalledWith('Model hiba');

    component.createCertificate(17);
    fixture.detectChanges();
    expect(console.log).toHaveBeenCalledWith('Model hiba');

    component.createCertificate(18);
    fixture.detectChanges();
    expect(console.log).toHaveBeenCalledWith('Model hiba');

    component.createCertificate(1);
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith('Certificate_id (', 1, ') is not valid.');


    spyOn(component.showModal, 'emit');

    component.createCertificate(2);
    fixture.detectChanges();
    newCertificate = new CertificationCommercialTakebackOne().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificationCommercialTakebackOneCreateEditComponent, newCertificate));

    component.createCertificate(3);
    fixture.detectChanges();
    newCertificate = new CertificationCommercialStockUpload().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificationCommercialStockUploadCreateEditComponent, newCertificate));

    component.createCertificate(5);
    fixture.detectChanges();
    newCertificate = new CertificationCommercialWeightLoss().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateCommercialWeightLossCreateEditComponent, newCertificate));

    component.createCertificate(6);
    fixture.detectChanges();
    newCertificate = new CertificationCustomerOrder().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateCustomerOrderCreateEditComponent, newCertificate));

    component.createCertificate(7);
    fixture.detectChanges();
    newCertificate = new CertificationIncomingDeliveryNote().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateIncomingDeliveryNoteCreateEditComponent, newCertificate));

    component.createCertificate(8);
    fixture.detectChanges();
    newCertificate = new CertificationIncomingGuarantee().init();
    newCertificate.seller_company_id = component.company.id;
    newCertificate.seller_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateIncomingGuaranteeCreateEditComponent, newCertificate));

    component.createCertificate(9);
    fixture.detectChanges();
    newCertificate = new CertificationIncomingInvoice().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateIncomingInvoiceCreateEditComponent, newCertificate));

    component.createCertificate(12);
    fixture.detectChanges();
    newCertificate = new CertificationOutgoingDeliveryNote().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateOutgoingDeliveryNoteCreateEditComponent, newCertificate));

    component.createCertificate(13);
    fixture.detectChanges();
    newCertificate = new CertificationOutgoingGuarantee().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateOutgoingGuaranteeCreateEditComponent, newCertificate));

    component.createCertificate(14);
    fixture.detectChanges();
    newCertificate = new CertificationOutgoingInvoice().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateOutgoingInvoiceCreateEditComponent, newCertificate));

    component.createCertificate(19);
    fixture.detectChanges();
    newCertificate = new CertificationReturnedFromCustomer().init();
    newCertificate.seller_company_id = component.company.id;
    newCertificate.seller_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificationReturnedFromCustomerCreateEditComponent, newCertificate));

    component.createCertificate(20);
    fixture.detectChanges();
    newCertificate = new CertificationReturnedToProducer().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateReturnToProducerCreateEditComponent, newCertificate));

    component.createCertificate(21);
    fixture.detectChanges();
    newCertificate = new CertificationScrappingProtocol().init();
    newCertificate.buyer_company_id = component.company.id;
    newCertificate.buyer_company = new Company().init(component.company);
    expect(component.showModal.emit).toHaveBeenCalledWith(new DialogContentItem(CertificateScrappingProtocolCreateEditComponent, newCertificate));

  });
});
