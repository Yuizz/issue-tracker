import { Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useHasMounted } from "~/hooks";
import { Sun, Moon } from "lucide-react";


export default function ColorModeButton({ height = "1.4rem", width = "1.4rem" }: { height?: string, width?: string }) {
  const { theme, setTheme } = useTheme()
  const handleChangeTheme = (currentTheme: string | undefined) => {
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }
  const hasMounted = useHasMounted()

  const props = {
    height,
    width
  }

  if (!hasMounted) return <Button isIconOnly><Sun {...props} /></Button>
  return (
    <Button isIconOnly variant="light" onClick={() => handleChangeTheme(theme)}>
      {theme === "dark" ?
        <Sun {...props} />
        :
        <Moon {...props} />
      }
    </Button>
  )

}