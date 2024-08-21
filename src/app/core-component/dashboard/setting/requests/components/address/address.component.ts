import { Component, OnInit, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeAddressService } from '../../../../../../services/EmployeeAddressService/employee-address.service';
import { EmployeeAddress } from '../../../../../../../models/employees.Model';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';


@Component({
  selector: 'app-address',
  standalone: true,
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css'],
  imports: [CommonModule, TranslateModule],
})
export class AddressComponent implements OnInit {
  public employeeAddress: EmployeeAddress[] = [];
  currentLang: string = localStorage.getItem('lang')!;
  @Input() employeeId: any;
  country: any[] = [];
  city: any[] = [];
  zone: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private employeeAddressService: EmployeeAddressService,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.employeeId = +params['id']; // Retrieve the employee ID from the route
      this.getEmployeeAddress(this.employeeId);
    });
  }

  getEmployeeAddress(id: any): void {
    if (id) {
      this.employeeAddressService.getEmployeeAddress({ employeeId: id }).subscribe(
        (response: any) => {
          if (response && response.length > 0) {
            this.employeeAddress = response;
            this.loadAddressDetails();
            console.log('Employee Address:', this.employeeAddress);
          } else {
            console.warn('No employee address data found');
          }
        },
        (error) => {
          console.error('Error fetching employee address:', error);
        }
      );
    } else {
      console.error('Employee ID is required to fetch the address.');
    }
  }

  private loadAddressDetails(): void {
    if (this.employeeAddress.length > 0) {
      this.getCountry(this.employeeAddress[0].countryId);
      this.getCity(this.employeeAddress[0].cityId);
      this.getZone(this.employeeAddress[0].zoneId);
      if (this.employeeAddress[1]) {
        this.getCountry(this.employeeAddress[1].countryId);
        this.getCity(this.employeeAddress[1].cityId);
        this.getZone(this.employeeAddress[1].zoneId);
      }
    }
  }

  private getCountry(id: any): void {
    if (id) {
      this.employeeService.getCountry({ id }).subscribe({
        next: (response) => {
          if (response && response.data && response.data.list) {
            this.country.push(response.data.list);
          }
        },
        error: (error) => console.error('Failed to load countries:', error),
      });
    }
  }

  private getCity(id: any): void {
    if (id) {
      this.employeeService.getCity({ id }).subscribe({
        next: (response) => {
          if (response && response.data && response.data.list) {
            this.city.push(response.data.list);
          }
        },
        error: (error) => console.error('Failed to load cities:', error),
      });
    }
  }

  private getZone(id: any): void {
    if (id) {
      this.employeeService.getZone({ id }).subscribe({
        next: (response) => {
          if (response && response.data && response.data.list) {
            this.zone.push(response.data.list);
          }
        },
        error: (error) => console.error('Failed to load zones:', error),
      });
    }
  }
}
