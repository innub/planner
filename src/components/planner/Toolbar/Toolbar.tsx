import DownloadIcon from '@/icons/DownloadIcon';
import EditIcon from '@/icons/EditIcon';
import { FC, useState } from 'react';
import Button from '../../Button';
import SwitchVerticalIcon from '@/icons/SwitchVerticalIcon';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useSemestersContext } from '../SemesterContext';
import FilterByDropdown from './FilterByDropdown';
import DegreePlanPDF from '../DegreePlanPDF/DegreePlanPDF';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import SettingsIcon from '@/icons/SettingsIcon';
import SettingsDropdown from './SettingsDropdown';
import EditSemestersModal from './EditSemestersModal';
import DeletePlanModal from '@/shared-components/DeletePlanModal';

export interface ToolbarProps {
  planId: string;
  title: string;
  major: string;
  studentName: string;
  deletePlan: () => void;
  deleteLoading: boolean;
}

const Toolbar: FC<ToolbarProps> = ({
  planId,
  title,
  major,
  studentName,
  deletePlan,
  deleteLoading,
}) => {
  const { allSemesters: semesters } = useSemestersContext();
  const [editSemestersModalOpen, setEditSemestersModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <section className="flex w-full flex-col justify-center gap-y-5">
      <article className="flex justify-between">
        <div className="flex items-center gap-2 text-primary-900">
          <button type="button" className="rounded-sm transition-all hover:bg-black/10">
            <Link href="/app/home">
              <ArrowBackIcon fontSize="medium" />
            </Link>
          </button>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        </div>
        <div className="flex h-min items-center gap-3">
          <Button size="medium" icon={<DownloadIcon />}>
            <PDFDownloadLink
              document={
                <DegreePlanPDF studentName={studentName} planTitle={title} semesters={semesters} />
              }
            >
              <span className="whitespace-nowrap" id="hello">
                Export Degree Plan
              </span>
            </PDFDownloadLink>
          </Button>

          <FilterByDropdown>
            <Button
              aria-label="Filter by options"
              size="medium"
              color="border"
              className="hover:bg-primary-100 hover:text-primary-900"
              icon={<SwitchVerticalIcon />}
            >
              <span className="whitespace-nowrap" id="world">
                Sort By
              </span>
            </Button>
          </FilterByDropdown>

          <EditSemestersModal
            closeModal={() => setEditSemestersModalOpen(false)}
            planId={planId}
            startSemester={semesters[0].code}
            endSemester={semesters[semesters.length - 1].code}
            open={editSemestersModalOpen}
            onOpenChange={setEditSemestersModalOpen}
          />
          <DeletePlanModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            deletePlan={deletePlan}
            deleteLoading={deleteLoading}
          />

          <SettingsDropdown
            openEditSemesterModal={() => setEditSemestersModalOpen(true)}
            openDeletePlanModal={() => setDeleteModalOpen(true)}
          >
            <SettingsIcon
              fill="var(--color-primary-900)"
              className="ml-8 mr-5 h-5 w-5 cursor-pointer"
            />
          </SettingsDropdown>
        </div>
      </article>

      <article className="flex justify-between pl-7">
        <button className="flex items-center gap-x-3 rounded-2xl bg-primary-100 py-2 px-3 tracking-tight">
          <span className="text-lg font-semibold text-primary-800">{major}</span>
          <EditIcon className="text-primary-800" />
        </button>
      </article>
    </section>
  );
};

export default Toolbar;