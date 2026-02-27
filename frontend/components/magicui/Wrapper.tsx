import Header from "@/components/magicui/Header";

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return(<>
            <Header/>
            {children}
    </>
            
    )
}