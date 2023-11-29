import { useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export function Done() {
  const router = useRouter();
  const search = useSearchParams();
  const step = search.get("step");

  const [_, startTransition] = useTransition();
  useEffect(() => {
    if (step === "done") {
      setTimeout(() => {
        startTransition(() => {
          router.push(`/dashboard`);
          router.refresh();
        });
      }, 2000);
    }
  }, [router, step]);

  return (
    <motion.div
      className=" flex h-full w-full flex-col items-center justify-center p-8"
      exit={{ opacity: 0, scale: 0.95 }}
      initial={{ background: "transparent" }}
      animate={{ background: "var(--background)" }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: 250 },
          show: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, type: "spring" },
          },
        }}
        initial="hidden"
        animate="show"
        className="bg-background/60 flex flex-col space-y-4 rounded-xl p-8"
      >
        <h1 className="font-cal text-2xl font-bold transition-colors sm:text-3xl">
          You are all set!
        </h1>
        <p className="text-muted-foreground max-w-md transition-colors sm:text-lg">
          Congratulations, you have successfully finished the condition
          assessment. Check out the{" "}
          <a
            href="https://docs.mithrid.health"
            target="_blank"
            rel="noopener noreferrer"
          >
            Clinical Docs
          </a>{" "}
          to learn more on our treatment process.
        </p>
        <p className="text-muted-foreground text-sm">
          You will be redirected to your patient dashboard momentarily.
        </p>
      </motion.div>
    </motion.div>
  );
}
