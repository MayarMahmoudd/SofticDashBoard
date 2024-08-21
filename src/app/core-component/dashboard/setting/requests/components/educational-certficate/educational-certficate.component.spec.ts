import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalCertficateComponent } from './educational-certficate.component';

describe('EducationalCertficateComponent', () => {
  let component: EducationalCertficateComponent;
  let fixture: ComponentFixture<EducationalCertficateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationalCertficateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EducationalCertficateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
