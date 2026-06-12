type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <section>
      <h2 className="text-display font-bold">{title}</h2>

      {description && <p className="font-semibold text-gray-600">{description}</p>}
    </section>
  );
}
