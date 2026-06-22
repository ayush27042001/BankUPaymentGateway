import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  BaseChartDirective
} from 'ng2-charts';

import {
  Chart,
  registerables,
  ChartConfiguration,
  ChartOptions
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})

export class Dashboard {

  /* =========================================
     REVENUE LINE CHART
  ========================================= */

  public revenueChartType: 'line' = 'line';

  public revenueChartData:
    ChartConfiguration<'line'>['data'] = {

    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],

    datasets: [

      {

        data: [
          120000,
          190000,
          170000,
          240000,
          320000,
          280000,
          360000,
          420000,
          390000,
          470000,
          520000,
          610000
        ],

        label: 'Revenue',

        fill: true,

        tension: 0.4,

        borderColor: '#9333ea',

        backgroundColor:
          'rgba(147, 51, 234, 0.12)',

        pointBackgroundColor:
          '#9333ea',

        pointBorderColor:
          '#ffffff',

        pointHoverBackgroundColor:
          '#ffffff',

        pointHoverBorderColor:
          '#9333ea',

        pointRadius: 5,

        borderWidth: 3

      }

    ]

  };

  public revenueChartOptions:
    ChartOptions<'line'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      }

    },

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {
          color: '#64748b'
        }

      },

      y: {

        grid: {
          color: '#eef2ff'
        },

        ticks: {

          color: '#64748b',

          callback: function (
            value: any
          ) {

            return (
              '₹'
              +
              value / 1000
              +
              'k'
            );

          }

        }

      }

    }

  };

  /* =========================================
     MERCHANT BAR CHART
  ========================================= */

  public merchantChartType: 'bar' = 'bar';

  public merchantChartData:
    ChartConfiguration<'bar'>['data'] = {

    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun'
    ],

    datasets: [

      {

        label: 'Merchants',

        data: [
          120,
          180,
          240,
          310,
          390,
          470
        ],

        borderRadius: 10,

        backgroundColor: [

          '#9333ea',
          '#a855f7',
          '#b66cff',
          '#c084fc',
          '#d8b4fe',
          '#e9d5ff'

        ]

      }

    ]

  };

  public merchantChartOptions:
    ChartOptions<'bar'> = {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

      legend: {
        display: false
      }

    },

    scales: {

      x: {

        grid: {
          display: false
        },

        ticks: {
          color: '#64748b'
        }

      },

      y: {

        grid: {
          color: '#eef2ff'
        },

        ticks: {
          color: '#64748b'
        }

      }

    }

  };

}