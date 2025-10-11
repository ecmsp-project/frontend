import * as React from "react";
import { Add, Remove } from "@mui/icons-material";
import { Box } from "@mui/material";
import AccordionMUI from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

interface AccordionProps {
  title: string;
  content: string | React.ReactNode;
  defaultExpanded?: boolean;
  disabled?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  content,
  defaultExpanded = false,
  disabled = false,
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const handleChange = () => {
    setExpanded(!expanded);
  };

  return (
    <AccordionMUI
      expanded={expanded}
      onChange={handleChange}
      disabled={disabled}
      sx={{
        backgroundColor: "grey.50",
        borderRadius: "0.75rem !important",
        marginBottom: "1rem",
        border: "0.0625rem solid grey.200",
        boxShadow: "0 0.125rem 0.25rem rgba(0,0,0,0.1)",
        "&:before": {
          display: "none",
        },
        "&.Mui-expanded": {
          margin: "0 0 1rem 0",
        },
        "&:hover": {
          backgroundColor: "grey.100",
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          <Box
            sx={{
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "1.5rem",
              height: "1.5rem",
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            {expanded ? <Remove /> : <Add />}
          </Box>
        }
        sx={{
          padding: "1.25rem 1.5rem",
          minHeight: "auto",
          "&.Mui-expanded": {
            minHeight: "auto",
          },
          "& .MuiAccordionSummary-content": {
            margin: "0",
            "&.Mui-expanded": {
              margin: "0",
            },
          },
        }}
      >
        <Typography
          component="span"
          sx={{
            color: "text.primary",
            fontSize: "1.125rem",
            fontWeight: "600",
            lineHeight: 1.4,
            pr: 2,
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: "0 1.5rem 1.5rem 1.5rem",
        }}
      >
        {typeof content === "string" ? (
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "1rem",
              lineHeight: 1.6,
              fontWeight: "400",
            }}
          >
            {content}
          </Typography>
        ) : (
          content
        )}
      </AccordionDetails>
    </AccordionMUI>
  );
};

export default Accordion;
