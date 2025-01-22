"use client";

type Props = {
  feature: {
    icon: any;
    text: string;
    description: string;
    color: string;
  };
};

const FeatureItem = ({ feature }: Props) => {
  return (
    <div className="flex items-start gap-3 space-y-3 space-y-reverse mt-2">
      <div
        className="p-2 rounded-full flex items-center justify-center text-white"
        style={{ backgroundColor: feature.color }}
      >
        <feature.icon width={18} height={18} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{feature.text}</p>
        <p className="text-xs text-[#A3A3A3]">{feature.description}</p>
      </div>
    </div>
  );
};

export default FeatureItem;
