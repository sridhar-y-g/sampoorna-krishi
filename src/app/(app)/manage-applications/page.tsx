'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ApplicationStatus = 'Pending' | 'Approved' | 'Rejected';

interface Application {
  id: number;
  applicantName: string;
  schemeName: string;
  type: 'Loan' | 'Scheme';
  submissionDate: string;
  status: ApplicationStatus;
}

const initialApplications: Application[] = [
  { id: 1, applicantName: 'Farmer Name', schemeName: 'Kisan Credit Card (KCC)', type: 'Loan', submissionDate: 'September 11th, 2025', status: 'Pending' },
  { id: 2, applicantName: 'Farmer Name', schemeName: 'Tractor Loan', type: 'Loan', submissionDate: 'September 11th, 2025', status: 'Pending' },
  { id: 3, applicantName: 'Another Farmer', schemeName: 'PM-KISAN Scheme', type: 'Scheme', submissionDate: 'September 10th, 2025', status: 'Pending' },
  { id: 4, applicantName: 'Farmer Four', schemeName: 'Agri Gold Loan', type: 'Loan', submissionDate: 'September 9th, 2025', status: 'Approved' },
  { id: 5, applicantName: 'Farmer Five', schemeName: 'Soil Health Card (SHC) Scheme', type: 'Scheme', submissionDate: 'September 8th, 2025', status: 'Rejected' },
];


export default function ManageApplicationsPage() {
    const { t } = useTranslation();
    const [applications, setApplications] = useState<Application[]>(initialApplications);

    const handleStatusChange = (id: number, newStatus: ApplicationStatus) => {
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status: newStatus } : app));
    };

  return (
    <>
      <PageHeader
        title={t('manageApplications.pageTitle')}
        description={t('manageApplications.pageDescription')}
      >
         <div className="bg-accent rounded-full p-3 mr-4">
            <Briefcase className="h-6 w-6 text-primary" />
        </div>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle>{t('manageApplications.submittedApplications.title')}</CardTitle>
          <CardDescription>
            {t('manageApplications.submittedApplications.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('manageApplications.table.applicantName')}</TableHead>
                        <TableHead>{t('manageApplications.table.schemeLoanName')}</TableHead>
                        <TableHead>{t('manageApplications.table.type')}</TableHead>
                        <TableHead>{t('manageApplications.table.submissionDate')}</TableHead>
                        <TableHead>{t('manageApplications.table.status')}</TableHead>
                        <TableHead className="text-right">{t('manageApplications.table.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.applicantName}</TableCell>
                            <TableCell>{app.schemeName}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{t(`manageApplications.types.${app.type.toLowerCase()}`)}</Badge>
                            </TableCell>
                            <TableCell>{app.submissionDate}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    app.status === 'Approved' ? 'default' : app.status === 'Rejected' ? 'destructive' : 'secondary'
                                } className={cn(
                                    app.status === 'Approved' && 'bg-green-100 text-green-800',
                                    app.status === 'Pending' && 'bg-amber-100 text-amber-800',
                                )}>
                                    {t(`manageApplications.statuses.${app.status.toLowerCase()}`)}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                {app.status === 'Pending' ? (
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(app.id, 'Approved')}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            {t('manageApplications.actions.approve')}
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleStatusChange(app.id, 'Rejected')}>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            {t('manageApplications.actions.reject')}
                                        </Button>
                                    </div>
                                ) : (
                                    <span className="text-sm text-muted-foreground">{t('manageApplications.actions.processed')}</span>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
