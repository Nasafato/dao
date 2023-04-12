import { useRef, useEffect } from "react";

export function useLogPropChanges(props: any) {
  const prevProps = useRef(props);

  useEffect(() => {
    const changedProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (prevProps.current[key] !== value) {
        acc[key] = { oldValue: prevProps.current[key], newValue: value };
      }
      return acc;
    }, {} as { [key: string]: { oldValue: any; newValue: any } });

    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }

    prevProps.current = props;
  });
}
