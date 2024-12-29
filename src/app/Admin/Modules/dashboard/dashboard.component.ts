import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  lineChartData: any;
  lineChartOptions: any;
  pieChartData: any;

  dashboardData: any = {
    products: { total: 0, instock: 0, lowstock: 0, outOfStock: 0 },
    categories: { total: 0, active: 0, inactive: 0 },
    orders: { total: 0, pending: 0, completed: 0 },
    users: { total: 0, active: 0, inactive: 0 },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchDashboardData();

    this.lineChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Arts',
          data: [30, 50, 40, 60, 70, 50],
          borderColor: '#42A5F5',
          fill: false,
        },
        {
          label: 'Commerce',
          data: [40, 30, 60, 40, 50, 60],
          borderColor: '#66BB6A',
          fill: false,
        },
      ],
    };

    this.lineChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
      },
    };

    this.pieChartData = {
      labels: ['New', 'Return'],
      datasets: [
        {
          data: [674, 182],
          backgroundColor: ['#FF6384', '#36A2EB'],
        },
      ],
    };
  }

  fetchDashboardData() {
    this.dashboardService.getDashboardData().subscribe((data) => {
      this.dashboardData = data;
    });
  }
}
