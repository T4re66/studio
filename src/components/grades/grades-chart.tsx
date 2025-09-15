"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import type { Grade } from '@/lib/data';
import { format, parseISO } from 'date-fns';

interface GradesChartProps {
    grades: Grade[];
}

const subjectCategories: { [key: string]: string } = {
    'Mathematik': 'MINT',
    'Physik': 'MINT',
    'Chemie': 'MINT',
    'Informatik': 'MINT',
    'Biologie': 'MINT',
    'Deutsch': 'Sprachen',
    'Englisch': 'Sprachen',
    'Latein': 'Sprachen',
    'Geschichte': 'Gesellschaft',
    'Ethik': 'Gesellschaft',
    'Geographie': 'Gesellschaft',
    'Kunst': 'Kreativ & Sport',
    'Musik': 'Kreativ & Sport',
    'Sport': 'Kreativ & Sport',
};

const categoryColors: { [key: string]: string } = {
    'MINT': '#8884d8',
    'Sprachen': '#82ca9d',
    'Gesellschaft': '#ffc658',
    'Kreativ & Sport': '#ff7300',
};


export function GradesChart({ grades }: GradesChartProps) {
    const { chartData, categories } = useMemo(() => {
        const gradesWithCategory = grades.map(g => ({ ...g, category: subjectCategories[g.subject] || 'Sonstige'}));
        const categories = [...new Set(Object.values(subjectCategories))];
        const dates = [...new Set(grades.map(g => format(parseISO(g.date), 'dd.MM.yy')))].sort((a,b) => parseISO(a.split('.').reverse().join('-')).getTime() - parseISO(b.split('.').reverse().join('-')).getTime());

        const chartData = dates.map(date => {
            const entry: {[key: string]: any} = { date };
            categories.forEach(category => {
                const gradesOnDate = gradesWithCategory.filter(g => format(parseISO(g.date), 'dd.MM.yy') === date && g.category === category);
                if (gradesOnDate.length > 0) {
                    const totalPoints = gradesOnDate.reduce((acc, g) => acc + g.grade * g.weight, 0);
                    const totalWeight = gradesOnDate.reduce((acc, g) => acc + g.weight, 0);
                    entry[category] = totalWeight > 0 ? totalPoints / totalWeight : null;
                } else {
                    entry[category] = null;
                }
            });
            return entry;
        });

        return { chartData, categories };
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
                    <YAxis reversed domain={[1,6]} ticks={[1,2,3,4,5,6]} allowDecimals={false} />
                    <Tooltip formatter={(value: number) => value ? value.toFixed(2) : ''}/>
                    <Legend />
                    {categories.map(category => (
                         <Bar 
                            key={category} 
                            dataKey={category} 
                            fill={categoryColors[category] || '#8884d8'}
                            maxBarSize={50}
                         />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
