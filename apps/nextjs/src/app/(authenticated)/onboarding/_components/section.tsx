"use client";

import { useEffect } from "react";

import { api } from "~/trpc/react";
import { CheckboxQuestion } from "./checkbox-question";
import { RadioQuestion } from "./radio-question";

interface SectionProps {
  sectionIndex: number;
  templateId: string;
}

export function Section(props: SectionProps) {
  const { sectionIndex, templateId } = props;

  const { isPending, isError, data, error } =
    api.assessmentInstance.byId.useQuery({ templateId });

  useEffect(() => {
    // Any logic that needs to happen when the section becomes active.
  }, [sectionIndex]);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const sectionJSON = data?.assessmentTemplate.template[sectionIndex];

  return (
    <div>
      {sectionJSON?.questions.map((questionJSON, questionIndex) => {
        const key = `${templateId}-${sectionIndex}-${questionIndex}`;
        if (questionJSON.type === "radio") {
          return (
            <RadioQuestion
              key={key}
              sectionIndex={sectionIndex}
              questionIndex={questionIndex}
              questionId={key}
              templateId={props.templateId}
            />
          );
        } else if (questionJSON.type === "checkbox") {
          return (
            <CheckboxQuestion
              key={key}
              sectionIndex={sectionIndex}
              questionIndex={questionIndex}
              questionId={key}
              templateId={props.templateId}
            />
          );
        } else {
          // handle unsupported types or throw an error
          console.warn("Unsupported question type:", questionJSON.type);
          return null;
        }
      })}
    </div>
  );
}
