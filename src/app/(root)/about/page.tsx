import { CircleArrowRight, Files, Settings } from "lucide-react";

const About1 = () => {
    return (
        <section className="py-10 mx-auto container px-4">
            <div className="container flex flex-col gap-28">
                <div className="grid gap-6 md:grid-cols-2">
                    <img
                        src="https://shadcnblocks.com/images/block/placeholder-1.svg"
                        alt="placeholder"
                        className="size-full max-h-96 rounded-2xl object-cover"
                    />
                    <div className="flex flex-col justify-between gap-10 rounded-2xl bg-muted p-10">
                        <p className="text-sm text-muted-foreground">
                            OUR MISSION
                        </p>
                        <p className="text-lg font-medium">
                            We believe that building software should be insanely
                            easy. That everyone should have the freedom to
                            create the tools they need, without any developers,
                            designers or drama.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-6 md:gap-20">
                    <div className="grid gap-10 md:grid-cols-3">
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                                <Files className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                Being radically open
                            </h3>
                            <p className="text-muted-foreground">
                                We believe there’s no room for big egos and
                                there’s always time to help each other. We
                                strive to give and receive feedback, ideas,
                                perspectives
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                                <CircleArrowRight className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                Moving the needle
                            </h3>
                            <p className="text-muted-foreground">
                                Boldly, bravely and with clear aims. We seek out
                                the big opportunities and double down on the
                                most important things to work on.
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-accent">
                                <Settings className="size-5" />
                            </div>
                            <h3 className="mb-3 mt-2 text-lg font-semibold">
                                Optimizing for empowerment
                            </h3>
                            <p className="text-muted-foreground">
                                We believe that everyone should be empowered to
                                do whatever they think is in the company&apos;s
                                best interests.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About1;
