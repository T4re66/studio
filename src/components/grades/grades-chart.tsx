"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo } from 'react';
import type { Grade } from '@/lib/data';

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
    'MINT': 'hsl(var(--primary))',
    'Sprachen': 'hsl(var(--accent))',
    'Gesellschaft': '#ffc658',
    'Kreativ & Sport': '#ff7300',
};


export function GradesChart({ grades }: GradesChartProps) {
    const chartData = useMemo(() => {
        const gradesWithCategory = grades.map(g => ({ ...g, category: subjectCategories[g.subject] || 'Sonstige'}));
        const categories = [...new Set(Object.values(subjectCategories))];
        
        const data = categories.map(category => {
            const categoryGrades = gradesWithCategory.filter(g => g.category === category);
            if (categoryGrades.length === 0) {
                return { name: category, averageGrade: 0 };
            }
            const totalPoints = categoryGrades.reduce((acc, g) => acc + g.grade * g.weight, 0);
            const totalWeight = categoryGrades.reduce((acc, g) => acc + g.weight, 0);
            const averageGrade = totalWeight > 0 ? totalPoints / totalWeight : 0;
            return {
                name: category,
                averageGrade: parseFloat(averageGrade.toFixed(2)),
                fill: categoryColors[category] || '#8884d8',
            }
        });
        
        return data.filter(d => d.averageGrade > 0);

    }, [grades]);

    if (grades.length === 0) {
        return <p className="text-center text-muted-foreground py-8">Noch keine Noten für ein Diagramm vorhanden.</p>
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <YAxis reversed domain={[1,6]} ticks={[1,2,3,4,5,6]} allowDecimals={false} stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                    <Tooltip 
                        cursor={{fill: 'hsla(var(--muted))'}}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col space-y-1">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
                                    <span className="font-bold text-foreground">{payload[0].value}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                    />
                    <Bar dataKey="averageGrade" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
