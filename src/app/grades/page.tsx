'use client'

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Plus, Sigma, GraduationCap } from "lucide-react"
import { AddGradeDialog } from "@/components/grades/add-grade-dialog"
import { GradesChart } from "@/components/grades/grades-chart"
import { GradesTable } from "@/components/grades/grades-table"
import { grades } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Grade } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export default function GradesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [allGrades, setAllGrades] = useState(grades);

    const handleAddGrade = (newGrade: Omit<Grade, 'id'>) => {
        const gradeWithId = { ...newGrade, id: `g${allGrades.length + 1}` };
        setAllGrades(prevGrades => [...prevGrades, gradeWithId]);
    }

    const { overallAverage, subjectAverages } = useMemo(() => {
        const totalPoints = allGrades.reduce((acc, g) => acc + g.grade * g.weight, 0);
        const totalWeight = allGrades.reduce((acc, g) => acc + g.weight, 0);
        const overallAverage = totalPoints / totalWeight;

        const subjects = [...new Set(allGrades.map(g => g.subject))];
        const subjectAverages = subjects.map(subject => {
            const subjectGrades = allGrades.filter(g => g.subject === subject);
            const subjectTotalPoints = subjectGrades.reduce((acc, g) => acc + g.grade * g.weight, 0);
            const subjectTotalWeight = subjectGrades.reduce((acc, g) => acc + g.weight, 0);
            return {
                subject,
                average: subjectTotalPoints / subjectTotalWeight,
            }
        }).sort((a,b) => a.average - b.average);

        return { overallAverage, subjectAverages };
    }, [allGrades]);

    return (
        <div className="flex flex-col gap-8">
             <div className="flex justify-between items-start flex-wrap gap-4">
                <PageHeader
                    title="Notenblatt"
                    description="Behalte den Überblick über deine schulischen Leistungen."
                />
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Note hinzufügen
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <Sigma />
                            Notendurchschnitt
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center p-6 bg-muted/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">Gesamtdurchschnitt</p>
                            <p className="text-4xl font-bold text-primary">{isNaN(overallAverage) ? 'N/A' : overallAverage.toFixed(2)}</p>
                        </div>
                        <div className="space-y-2">
                             <h4 className="font-semibold text-sm">Fächer im Detail</h4>
                             {subjectAverages.map(({subject, average}) => (
                                <div key={subject} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-muted/50">
                                    <span className="font-medium">{subject}</span>
                                    <Badge variant={average <= 2 ? "default" : average <= 4 ? "secondary" : "destructive"}>{average.toFixed(2)}</Badge>
                                </div>
                             ))}
                        </div>
                    </CardContent>
                </Card>
                <div className="lg:col-span-2 flex flex-col gap-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Notenentwicklung</CardTitle>
                            <CardDescription>Deine Noten über die Zeit visualisiert.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <GradesChart grades={allGrades} />
                        </CardContent>
                    </Card>
                </div>
            </div>


            <Card>
                <CardHeader>
                    <CardTitle>Alle Noten</CardTitle>
                    <CardDescription>Eine detaillierte Liste all deiner erfassten Noten.</CardDescription>
                </CardHeader>
                <CardContent>
                    <GradesTable grades={allGrades} />
                </CardContent>
            </Card>

            <AddGradeDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onAddGrade={handleAddGrade} />
        </div>
    )
}
