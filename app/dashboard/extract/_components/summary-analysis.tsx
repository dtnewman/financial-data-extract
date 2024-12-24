import { SummaryAnalysis } from '@/app/types/summary';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SummaryAnalysisProps {
    analysisResults?: {
        transactions: Array<{
            date: string;
            description: string;
            credit_amount: number | null;
            debit_amount: number | null;
            category: string;
            summary: string;
        }>;
        start_balance: number | null;
        end_balance: number | null;
    };
}

export function SummaryAnalysisComponent({ analysisResults }: SummaryAnalysisProps) {
    const [analysis, setAnalysis] = useState<{
        summary: string;
        risk_factors: string[];
        risk_assessment: 'Risky' | 'Neutral' | 'Not Risky';
    }>();

    useEffect(() => {
        async function fetchAnalysis() {
            if (!analysisResults) return;

            // Calculate category totals
            const categoryTotals = analysisResults.transactions.reduce(
                (acc, transaction) => {
                    const category = transaction.category;
                    if (!acc[category]) {
                        acc[category] = { credits: 0, debits: 0 };
                    }
                    acc[category].credits += transaction.credit_amount ?? 0;
                    acc[category].debits += transaction.debit_amount ?? 0;
                    return acc;
                },
                {} as Record<string, { credits: number; debits: number }>
            );

            // Calculate totals
            const totalCredits = analysisResults.transactions.reduce(
                (sum, t) => sum + (t.credit_amount ?? 0),
                0
            );
            const totalDebits = analysisResults.transactions.reduce(
                (sum, t) => sum + (t.debit_amount ?? 0),
                0
            );

            try {
                const response = await fetch('/api/analyze-summary', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        categoryTotals,
                        startBalance: analysisResults.start_balance,
                        endBalance: analysisResults.end_balance,
                        totalCredits,
                        totalDebits
                    })
                });

                if (!response.ok) throw new Error('Analysis failed');
                const data = await response.json();
                setAnalysis(data);
            } catch (error) {
                console.error('Error fetching analysis:', error);
            }
        }

        fetchAnalysis();
    }, [analysisResults]);

    if (!analysis) {
        return (
            <Card className="p-4">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                        Analyzing financial data...
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <div className="space-y-4">
                <div>
                    <h3 className="font-medium">Summary Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1">{analysis.summary}</p>
                </div>

                <div>
                    <h3 className="font-medium">Risk Assessment</h3>
                    <ul className="mt-1 space-y-1">
                        {analysis.risk_factors.map((factor, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                                • {factor}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-2">
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${analysis.risk_assessment === 'Risky'
                                ? 'bg-red-100 text-red-700'
                                : analysis.risk_assessment === 'Neutral'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                                }`}
                        >
                            {analysis.risk_assessment}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
} 