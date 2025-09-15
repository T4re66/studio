'use client'

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddGradeDialog } from "@/components/grades/add-grade-dialog"
import { GradesChart } from "@/components/grades/grades-chart"
import { GradesTable } from "@/components/grades/grades-table"
import { grades } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function GradesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [allGrades, setAllGrades] = useState(grades);

    const handleAddGrade = (newGrade: any) => {
        const gradeWithId = { ...newGrade, id: `g${allGrades.length + 1}` };
        setAllGrades(prevGrades => [...prevGrades, gradeWithId]);
    }

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

            <Card>
                <CardHeader>
                    <CardTitle>Notenentwicklung</CardTitle>
                    <CardDescription>Deine Noten über die Zeit visualisiert.</CardDescription>
                </CardHeader>
                <CardContent>
                     <GradesChart grades={allGrades} />
                </CardContent>
            </Card>

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
