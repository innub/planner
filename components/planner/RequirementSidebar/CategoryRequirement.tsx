import InfoIcon from '@mui/icons-material/Info';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import { CategoryRequirement } from '../../../modules/planner/types';

export function CategoryRequirement() {
  let props: CategoryRequirement;
  // TODO: Write logic to render Category Requirement children
  let children;

  return (
    <Accordion className="my-2 w-full bg-white rounded-xl hover:bg-gray-100 border-gray-200 border-2 ">
      <AccordionSummary
        className="flex flex-row"
        expandIcon={<InfoIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className=""> Put category info here </div>
      </AccordionSummary>

      <AccordionDetails className="flex flex-col">{children}</AccordionDetails>
    </Accordion>
  );
}
