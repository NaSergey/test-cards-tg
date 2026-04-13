interface ArrowUpProps {
  bgColor?: string;
}

export default function ArrowUp({ bgColor = "#DCDCDC" }: ArrowUpProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="12" fill={bgColor}/>
      <path d="M12 17.7461L12 7.24609" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 11.2539L12 6.25391L17 11.2539" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
