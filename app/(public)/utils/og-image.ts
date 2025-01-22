type Params = {
  title: string;
  description?: string;
};

const GenerateOGImage = ({
  title,
  description = "Clipmate AI - The 2nd brain you know you need",
}: Params): string => {
  return `https://og.tailgraph.com/og?fontFamily=Inter&title=${title}&titleTailwind=font-bold%20text-6xl%20text-white&titleFontFamily=Inter&text=${description}&textTailwind=text-2xl%20text-white%20opacity-70%20opacity-70%20opacity-70%20mt-5%20max-w-%5B50ch%5D&textFontFamily=Inter&logoUrl=https%3A%2F%2Fapp.clipmate.ai%2Fclipmate.ai.png&logoTailwind=h-12%20mx-auto%20mb-3&bgTailwind=bg-black&footer=clipmate.ai&footerTailwind=text-orange-600&t=1724673739440&refresh=1`;
};

export default GenerateOGImage;
