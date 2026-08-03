export type MenuItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  calories: number;
  featured: number;
  image: string;
};

export const categories = ["الكل", "اللحم", "الدجاج", "الفطور", "المشروبات الساخنة"];

export const previewItems: MenuItem[] = [
  { id: 1, name: "ذبيحة كاملة", category: "اللحم", description: "ذبيحة كاملة تُحضّر على اختيارك: مندي، مظبي، سليق أو حنيذ، مع أرز بسمتي فاخر.", price: 1360, calories: 10800, featured: 1, image: "lamb" },
  { id: 2, name: "نصف ذبيحة", category: "اللحم", description: "نصف ذبيحة طرية متبلة بخلطة البادية الخاصة، تُقدّم مع الأرز والمقبلات.", price: 680, calories: 5400, featured: 0, image: "lamb" },
  { id: 3, name: "ربع ذبيحة", category: "اللحم", description: "ربع ذبيحة بطهي حضرمي أصيل؛ مناسبة للعائلة الصغيرة أو الجمعات.", price: 340, calories: 2700, featured: 0, image: "lamb" },
  { id: 4, name: "نفر لحم", category: "اللحم", description: "قطع لحم طرية مع أرز المندي المبهر ونكهة الدخان الهادئة.", price: 85, calories: 980, featured: 1, image: "lamb" },
  { id: 5, name: "برمة لحم", category: "اللحم", description: "لحم يُطهى ببطء في البرمة حتى يصبح طريًا وغنيًا بالنكهة.", price: 75, calories: 860, featured: 0, image: "lamb" },
  { id: 6, name: "نفر عصيدة", category: "اللحم", description: "عصيدة حضرمية دافئة بقوام ناعم وتقديم تقليدي.", price: 10, calories: 410, featured: 0, image: "breakfast" },
  { id: 7, name: "حبة دجاج", category: "الدجاج", description: "حبة دجاج كاملة باختيارك: مندي، مظبي، مضغوط، حنيذ أو شواية.", price: 40, calories: 1280, featured: 1, image: "chicken" },
  { id: 8, name: "نصف دجاج", category: "الدجاج", description: "نصف دجاج متبّل بتوابل حضرمية ومطهو حتى الاحمرار، مع أرز بسمتي.", price: 20, calories: 720, featured: 0, image: "chicken" },
  { id: 9, name: "حبة دجاج سادة", category: "الدجاج", description: "حبة دجاج كاملة بدون أرز، متبلة ومطهية بخلطة المطعم.", price: 28, calories: 980, featured: 0, image: "chicken" },
  { id: 10, name: "نصف دجاج سادة", category: "الدجاج", description: "نصف دجاج طازج بدون أرز، متبل ومطهو حتى الاحمرار.", price: 14, calories: 520, featured: 0, image: "chicken" },
  { id: 11, name: "مقلقل", category: "الفطور", description: "قطع لحم طازجة مقلقلة مع البصل والفلفل والبهارات.", price: 25, calories: 520, featured: 1, image: "breakfast" },
  { id: 12, name: "كبدة", category: "الفطور", description: "كبدة طازجة مشوحة مع البصل والفلفل والبهارات.", price: 20, calories: 460, featured: 0, image: "breakfast" },
  { id: 13, name: "مشكل", category: "الفطور", description: "تشكيلة من أطباق الفطور الشعبية في طبق واحد.", price: 15, calories: 620, featured: 0, image: "breakfast" },
  { id: 14, name: "شوربة", category: "الفطور", description: "شوربة يومية دافئة وخفيفة، تُحضّر طازجة.", price: 2, calories: 120, featured: 0, image: "breakfast" },
  { id: 15, name: "دلة قهوة مع التمر", category: "المشروبات الساخنة", description: "قهوة عربية متوازنة مع تمر مختار لإتمام تجربة الضيافة.", price: 20, calories: 190, featured: 1, image: "drink" },
  { id: 16, name: "دلة قهوة", category: "المشروبات الساخنة", description: "دلة قهوة عربية محمصة بالهيل وتُقدّم على أصول الكرم.", price: 15, calories: 35, featured: 0, image: "drink" },
  { id: 17, name: "كاسة شاي عدني", category: "المشروبات الساخنة", description: "شاي عدني كريمي بالحليب والتوابل العطرية.", price: 2, calories: 160, featured: 0, image: "drink" },
  { id: 18, name: "كاسة شاي أحمر", category: "المشروبات الساخنة", description: "كاسة شاي أحمر كلاسيكي تُحضّر عند الطلب.", price: 1, calories: 25, featured: 0, image: "drink" },
  { id: 19, name: "براد شاي عدني كبير", category: "المشروبات الساخنة", description: "براد كبير من الشاي العدني بالحليب والتوابل العطرية.", price: 15, calories: 480, featured: 0, image: "drink" },
  { id: 20, name: "براد شاي عدني صغير", category: "المشروبات الساخنة", description: "براد صغير من الشاي العدني بالحليب والتوابل العطرية.", price: 10, calories: 300, featured: 0, image: "drink" },
  { id: 21, name: "براد شاي أحمر كبير", category: "المشروبات الساخنة", description: "براد كبير من الشاي الأحمر الكلاسيكي.", price: 10, calories: 80, featured: 0, image: "drink" },
  { id: 22, name: "براد شاي أحمر صغير", category: "المشروبات الساخنة", description: "براد صغير من الشاي الأحمر الكلاسيكي.", price: 5, calories: 45, featured: 0, image: "drink" },
];

export async function fetchMenu(): Promise<MenuItem[]> {
  const response = await fetch("/api/menu", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "تعذر تحميل المنيو");
  return data.items;
}
