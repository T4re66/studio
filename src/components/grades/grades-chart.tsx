"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
    'Biologie': '#FF8042',
};

export function GradesChart({ grades }: GradesChartProps) {
    const { chartData, subjects } = useMemo(() => {
        const data = [...grades].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
        const subjects = [...new Set(data.map(g => g.subject))];
        const dates = [...new Set(data.map(g => format(parseISO(g.date), 'dd.MM.yy')))].sort((a,b) => parseISO(a.split('.').reverse().join('-')).getTime() - parseISO(b.split('.').reverse().join('-')).getTime());

        const chartData = dates.map(date => {
            const entry: {[key: string]: any} = { date };
            subjects.forEach(subject => {
                const gradeOnDate = data.find(g => format(parseISO(g.date), 'dd.MM.yy') === date && g.subject === subject);
                entry[subject] = gradeOnDate ? gradeOnDate.grade : null;
            });
            return entry;
        });

        return { chartData, subjects };
    }, [grades]);

    if (grades.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Noch keine Noten für ein Diagramm vorhanden.</p>
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis reversed domain={[1,6]} ticks={[1,2,3,4,5,6]} />
                    <Tooltip />
                    <Legend />
                    {subjects.map(subject => (
                         <Bar 
                            key={subject} 
                            dataKey={subject} 
                            fill={subjectColors[subject] || '#8884d8'} 
                         />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
