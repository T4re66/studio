"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import type { Grade } from '@/lib/data';
import { format, parseISO } from 'date-fns';

interface GradesChartProps {
    grades: Grade[];
}

const subjectColors: { [key: string]: string } = {
    'Mathematik': '#8884d8',
    'Deutsch': '#82ca9d',
    'Englisch': '#ffc658',
    'Physik': '#ff7300',
    'Chemie': '#00C49F',
};


export function GradesChart({ grades }: GradesChartProps) {
    const dataBySubject = useMemo(() => {
        const subjects: { [key: string]: {name: string, date: string, grade: number}[] } = {};
        
        grades.forEach(grade => {
            if (!subjects[grade.subject]) {
                subjects[grade.subject] = [];
            }
            subjects[grade.subject].push({
                name: grade.subject,
                date: format(parseISO(grade.date), 'dd.MM'),
                grade: grade.grade
            });
        });

        // Sort each subject's grades by date
        Object.keys(subjects).forEach(subject => {
            subjects[subject].sort((a,b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
        })

        const allDates = [...new Set(grades.map(g => format(parseISO(g.date), 'dd.MM')))].sort();

        const chartData = allDates.map(date => {
            const entry: {[key: string]: any} = { date };
            Object.keys(subjects).forEach(subject => {
                const gradeOnDate = subjects[subject].find(s => s.date === date);
                entry[subject] = gradeOnDate ? gradeOnDate.grade : null;
            });
            return entry;
        })


        return { chartData, subjects: Object.keys(subjects) };

    }, [grades]);

    if (grades.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Noch keine Noten für ein Diagramm vorhanden.</p>
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <LineChart data={dataBySubject.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis reversed domain={[1,6]} ticks={[1,2,3,4,5,6]} />
                    <Tooltip />
                    <Legend />
                    {dataBySubject.subjects.map(subject => (
                         <Line 
                            key={subject} 
                            type="monotone" 
                            dataKey={subject} 
                            stroke={subjectColors[subject] || '#8884d8'} 
                            connectNulls 
                         />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
