import { Label } from "../ui/label"

export const WrapperComponent = (props: { children: React.ReactNode, text: string, id: number }) => {
    return (
        <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
            <Label className="text-base text-muted-foreground" htmlFor={`checkbox-element-${props.id}`}>{props.text}</Label>
            {props.children}
        </div>
    )
}