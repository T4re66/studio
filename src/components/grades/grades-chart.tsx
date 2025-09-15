"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
                <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                     <defs>
                        {subjects.map(subject => (
                            <linearGradient key={subject} id={`color${subject.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={subjectColors[subject] || '#8884d8'} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={subjectColors[subject] || '#8884d8'} stopOpacity={0}/>
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis reversed domain={[1,6]} ticks={[1,2,3,4,5,6]} />
                    <Tooltip />
                    <Legend />
                    {subjects.map(subject => (
                         <Area 
                            key={subject} 
                            type="monotone" 
                            dataKey={subject} 
                            stroke={subjectColors[subject] || '#8884d8'} 
                            fillOpacity={1} 
                            fill={`url(#color${subject.replace(/\s/g, '')})`}
                            connectNulls 
                         />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
