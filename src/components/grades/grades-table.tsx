'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Grade } from "@/lib/data"
import { format, parseISO } from "date-fns"
import { de } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";

interface GradesTableProps {
    grades: Grade[];
}

const gradeTypeColors: {[key: string]: string} = {
    'Klausur': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Mündlich': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    'Projekt': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300'
}

export function GradesTable({ grades }: GradesTableProps) {
    const sortedGrades = [...grades].sort((a,b) => parseISO(b.date).getTime() - parseISO(a.date).getTime())

    return (
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[150px]">Fach</TableHead>
                <TableHead>Art</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Notizen</TableHead>
                <TableHead className="text-right">Note</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedGrades.map((grade) => (
                    <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.subject}</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={gradeTypeColors[grade.type]}>{grade.type}</Badge>
                        </TableCell>
                        <TableCell>{format(parseISO(grade.date), 'dd. MMMM yyyy', {locale: de})}</TableCell>
                        <TableCell className="text-muted-foreground">{grade.notes || '-'}</TableCell>
                        <TableCell className="text-right font-bold">{grade.grade.toFixed(1)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
