import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ChartData {
    labels: string[];
    datasets: {
        label?: string;
        data: number[];
        backgroundColor: string[];
        borderColor?: string[];
        borderWidth?: number;
    }[];
}

interface Stat {
    labels: string[];
    data: number[];
}

@Injectable({
    providedIn: 'root',
})
export class StatsService {
    constructor(private http: HttpClient) {}

    private departmentColors = [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
    ];

    private courseColors = [
        'rgba(255, 159, 64, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 205, 86, 0.7)',
        'rgba(201, 203, 207, 0.7)',
        'rgba(75, 192, 192, 0.7)',
    ];

    private completionColors = [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
    ];

    getDepartmentStats(): Observable<Stat> {
        return this.http.get<Stat>('http://localhost:8000/stats/department');
    }

    getCourseStats(): Observable<Stat> {
        return this.http.get<Stat>('http://localhost:8000/stats/courses');
    }

    getCompletionStats(): Observable<Stat> {
        return this.http.get<Stat>('http://localhost:8000/stats/completion');
    }

    getDeptChartData(): Observable<ChartData> {
        return this.getDepartmentStats().pipe(
            map(data => ({
                labels: data.labels,
                datasets: [{
                    label: 'Students',
                    data: data.data,
                    backgroundColor: this.departmentColors,
                    borderColor: this.departmentColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1,
                }],
            }))
        );
    }

    getCourseChartData(): Observable<ChartData> {
        return this.getCourseStats().pipe(
            map(data => ({
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: this.courseColors,
                    borderColor: this.courseColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1,
                }],
            }))
        );
    }

    getPassFailChartData(): Observable<ChartData> {
        return this.getCompletionStats().pipe(
            map(data => ({
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: this.completionColors,
                    borderColor: this.completionColors.map(color => color.replace('0.7', '1')),
                    borderWidth: 1,
                }],
            }))
        );
    }
}