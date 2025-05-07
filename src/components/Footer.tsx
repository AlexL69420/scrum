
import { Footer, FooterBrand, FooterCopyright, FooterDivider, FooterLink, FooterLinkGroup } from "flowbite-react";

export function MyFooter() {
  return (
    <Footer container className="px-12 bg-emerald-100 dark:bg-emerald-950 dark:text-white">
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <FooterBrand
            href="https://github.com/AlexL69420/scrum"
            src="https://i.pinimg.com/736x/8b/6b/98/8b6b987316a515a6c4d77684e32cccc7.jpg"
            alt="logo"
            name="Alexander&Nikita"
          />
          <FooterLinkGroup className="flex flex-wrap gap-3 w-1/2">
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Licensing</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </FooterLinkGroup>
        </div>
        <FooterDivider />
        <FooterCopyright href="#" by="Alexander&Nikita™" year={2025} />
      </div>
    </Footer>
  );
}
