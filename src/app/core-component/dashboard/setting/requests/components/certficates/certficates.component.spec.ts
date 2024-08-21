import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertficatesComponent } from './certficates.component';

describe('CertficatesComponent', () => {
  let component: CertficatesComponent;
  let fixture: ComponentFixture<CertficatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertficatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertficatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
