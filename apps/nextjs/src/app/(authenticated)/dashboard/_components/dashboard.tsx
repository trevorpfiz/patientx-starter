import { cn } from "@acme/ui";

const navigation = [
  { name: "Forms", href: "/dashboard/forms", current: false },
  { name: "Appointments", href: "/dashboard/appointments", current: false },
  { name: "Conditions", href: "/dashboard/conditions", current: false },
  { name: "Medications", href: "/dashboard/medications", current: false },
  { name: "Immunizations", href: "/dashboard/immunizations", current: false },
  { name: "Allergies", href: "/dashboard/allergies", current: false },
  { name: "Test Results", href: "/dashboard/test-results", current: false },
];

export default function Dashboard() {
  return (
    <nav className="flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" className="-mx-2 space-y-1">
        {navigation.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              className={cn(
                item.current
                  ? "bg-gray-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                "group flex gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6",
              )}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
