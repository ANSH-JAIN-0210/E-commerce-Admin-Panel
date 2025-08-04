import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartService } from '../services/chart.service';
import {
  SeriesColumnOptions,
  SeriesLineOptions,
  SeriesAreaOptions,
} from 'highcharts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chart',
  standalone: false,
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnInit {
  chartType: 'column' | 'area' | 'line' = 'column';
  chartData: 'user' | 'product' | 'order' | 'category' = 'user';
  chartFilter = 'day';
  public Highcharts: typeof Highcharts = Highcharts;

  public chartOptions: Highcharts.Options = {
    chart: {
      type: this.chartType,
    },
    title: {
      text: `${this.chartData.toUpperCase()} DETAILS`,
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xAxis: {
      categories: [],
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
        },
      },
    },

    series: [],
  };

  constructor(private chartService: ChartService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.getUsers();
  }
  dateFormat(timestamp: string) {
    let formattedDate;
    if (this.chartFilter === 'yearly')
      formattedDate = this.datePipe.transform(timestamp, 'yyyy');
    else if (this.chartFilter === 'monthly')
      formattedDate = this.datePipe.transform(timestamp, 'MMM yyyy');
    else if (this.chartFilter === 'weekly') {
      const date = new Date(timestamp);
      const weekStart = new Date(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const startStr = this.datePipe.transform(weekStart, 'd MMM');
      const endStr = this.datePipe.transform(weekEnd, 'd MMM');
      const yearStr = this.datePipe.transform(weekStart, 'yyyy');

      formattedDate = `${startStr} - ${endStr}, ${yearStr}`;
    } else formattedDate = this.datePipe.transform(timestamp, 'mediumDate');

    return formattedDate;
  }

  setDataType(Data: 'user' | 'product' | 'order' | 'category') {
    this.chartData = Data;
    this.getUsers();
  }

  setChartType(chart: 'column' | 'area' | 'line') {
    this.chartType = chart;
    this.getUsers();
  }

  getUsers() {
    this.chartService.get(this.chartData).subscribe({
      next: (res) => {
        console.log('Details: ', res);
        const data = res.data[this.chartFilter];
        console.log('Filter', this.chartFilter);
        console.log('data', data);
        let users_products_categories = [
          { name: `Newly Created ${this.chartData}`, key: 'newlyCreated' },
          { name: `Total ${this.chartData}`, key: 'total' },
          { name: `Active ${this.chartData}`, key: 'totalActive' },
          { name: `Inactive ${this.chartData}`, key: 'totalInactive' },
          { name: `Deleted ${this.chartData}`, key: 'totalDeleted' },
        ];

        let orders = [
          { name: 'Newly Created Order', key: 'newlyCreated' },
          { name: 'Total Order', key: 'total' },
          { name: 'Pending Order', key: 'totalPending' },
          { name: 'Processing Order', key: 'totalProcessing' },
          { name: 'Shipped Order', key: 'totalShipped' },
          { name: 'Delivered Order', key: 'totalDelivered' },
          { name: 'Cancelled Order', key: 'totalCancelled' },
        ];

        let seriesNames = [];
        if (this.chartData === 'order') seriesNames = orders;
        else seriesNames = users_products_categories;
        let series:
          | SeriesColumnOptions[]
          | SeriesAreaOptions[]
          | SeriesLineOptions[];
        series = seriesNames.map((s) => ({
          name: s.name,
          type: this.chartType,
          data: data.map((d: any) => ({
            name: this.dateFormat(d.period),
            y: d[s.key],
          })),
        })) as
          | SeriesColumnOptions[]
          | SeriesAreaOptions[]
          | SeriesLineOptions[];
        console.log(series);

        this.chartOptions = {
          ...this.chartOptions,
          title: {
            text: `${this.chartData.toUpperCase()} DETAILS`,
          },
          xAxis: {
            type: 'category',
          },
          series,
        };
        console.log(this.chartOptions);

        Highcharts.chart('chart-container', this.chartOptions);
      },
    });
  }
}
