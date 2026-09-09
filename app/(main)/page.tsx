import { AppleFeatureLaurelsBadge } from "@/components/apple_feature_laurels_badge/apple_feature_laurels_badge";
import { CardGrid } from "@/components/card_grid/card_grid";
import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { EmailForm } from "@/components/email_form/email_form";
import { Hero } from "@/components/hero/hero";
import { RatingLaurelsBadge } from "@/components/rating_laurels_badge/rating_laurels_badge";
import { Section } from "@/components/section/section";
import { TestimonialsGrid } from "@/components/testimonials_grid/testimonials_grid";
import { IS_WAITLIST_ENABLED } from "@/constants";

import styles from "./page.module.css";

export default function Page() {
  if (IS_WAITLIST_ENABLED) {
    return (
      <>
        <div className={styles.waitlistSpacer} />

        <Section paddingTop={60}>
          <Hero
            title="Zenith — Reduce Screen Time for iPhone and iPad."
            subtitle="Stop doom scrolling. Start living."
            media={
              <Hero.Image
                src="/app_view/screenshot_placeholder.png"
                alt=""
                bezel="iPhone 17 Black"
              />
            }
            action={
              <>
                <EmailForm
                  providerConfig={{
                    provider: "loops",
                    config: {
                      formId: "your-loops-form-id",
                    },
                  }}
                />
                {/*
                  You can also use a simple button to redirect users
                  to a custom page where you collect emails
                */}
                {/* <GetNotifiedActionButton href="your-email-form-link" /> */}
              </>
            }
          />
        </Section>
      </>
    );
  }

  return (
    <>
      <Section paddingTop={100}>
        <Hero
          title="Stop doom scrolling. Start living."
          subtitle="Zenith helps you take control of your day by reducing screen time."
          media={
            <Hero.Image
              src="/app_view/Goals.png"
              bezel="iPhone 17 Black"
              alt=""
            />
          }
          /* badges={
            <>
              <RatingLaurelsBadge
                showStars={true}
                rating={4.9}
                caption="worldwide rating"
              />
              <AppleFeatureLaurelsBadge featureName="App of the Day" />
            </>
          } */
          action={<DownloadActionButton size="medium" />}
        />
      </Section>

      <Section navigationAnchor="features">
        <CardGrid rowHeight={438}>

          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Get time for what matters"
            description="Zenith helps you take back control with app limits."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Limits.png"
                alt="Make sure to provide an image description for accessibility purposes"
                bezel="iPhone 17 Black"
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="third"
            title="Live with intention"
            description="Set custom limits for apps that distract you."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Limits-2.png"
                srcset={[
                  {
                    src: "/app_view/Limits-2.png",
                    theme: "dark",
                  },
                ]}
                alt="Grid"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.1 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="third"
            title="Discover a new you"
            description="Zenith helps you unlock new dimensions of yourself."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Layers.png"
                srcset={[
                  {
                    src: "/app_view/Layers.png",
                    theme: "dark",
                  },
                ]}
                alt="Grid"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.1 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Thrive with Zenith"
            description="A growing library of tools and activities to help you get more out of life."
            layoutDirection="reverse"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Thrive.png"
                alt="Make sure to provide an image description for accessibility purposes"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.25 }}
              />
            }
            textAlignment="leading"
          />

          {/* <CardGrid.OverlaidCard
            maxWidth="third"
            imageSrc="/app_view/overlay_image_placeholder_light.png"
            imageSrcset={[
              {
                src: "/app_view/overlay_image_placeholder_dark.png",
                theme: "dark",
              },
            ]}
            title="Feature On An Overlay Card"
            description="These look great with photos or a custom graphics if you're willing to go the extra mile"
            textAlignment="center"
          /> */}

          <CardGrid.StackedCard
            maxWidth="half"
            title="Enjoy a growing library of inspiring wallpapers"
            titleFontStyle="cursive"
            description="Turn your lock screen into a daily reminder of what matters."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Wallpaper.png"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.5 }}
                alt=""
              />
            }
            layoutDirection="reverse"
            textAlignment="center"
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="Restore calm and focus"
            description="A curated collection of research-backed breathing practices."
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/Breathing.png"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "top", croppedRatio: 0.2 }}
                alt=""
              />
            }
            layoutDirection="forward"
            textAlignment="center"
          />

          <CardGrid.OverlaidCard
            maxWidth="full"
            imageSrc="/app_view/Sanctuary.jpg"
            imageSrcset={[
              {
                src: "/app_view/Sanctuary.jpg",
                theme: "dark",
              },
            ]}
            title="Create a Zenith you love"
            description="From first ideas to new features, the people using Zenith help shape what we build."
            textAlignment="center"
            textColorTheme="dark"
          />

          {/*<CardGrid.StackedCard
            maxWidth="full"
            title="Huge Card For a Major Feature"
            description="Zoomed in UI or a custom graphic look great here"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/stacked_card_image_placeholder_light.png"
                srcset={[
                  {
                    src: "/app_view/stacked_card_image_placeholder_dark.png",
                    theme: "dark",
                  },
                ]}
                alt="Grid"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.1 }}
              />
            }
          />*/}

        </CardGrid>
      </Section>

      {/* <Section title="What people are saying" navigationAnchor="testimonials">
        <TestimonialsGrid maxColumnCount={2}>
          <TestimonialsGrid.Testimonial
            message="Showing social proof is very important. Show some nice words about your app from social media or App Store reviews."
            authorName="Jane Doe"
            authorTitle="Person's Title"
            authorImageUrl="/app_view/profile_image_placeholder.png"
            messageFontStyle="italic"
            source="https://threads.com/some-thread-message"
          ></TestimonialsGrid.Testimonial>

          <TestimonialsGrid.Testimonial
            message="If it's an App Store review, make sure to show the stars rating, it catches attention and add visual variety."
            authorName="John Smith"
            source="appStore"
            starsRating={true}
          ></TestimonialsGrid.Testimonial>

          <TestimonialsGrid.Testimonial
            message="Include a link to the testimonial's source when possible, this makes them look more trustworthy"
            authorName="Emily Johnson"
            source="https://reddit.com/some-thread-message"
          ></TestimonialsGrid.Testimonial>

          <TestimonialsGrid.Testimonial
            message="Having person's credentials could also help build trust, especially if they are relevant to your app's domain."
            authorName="Michael Brown"
            authorTitle="CEO of Some Company"
            source="https://x.com/some-thread-message"
          ></TestimonialsGrid.Testimonial>
        </TestimonialsGrid>
      </Section> */}

      {/* <Section title="Additional Highlights">
        <CardGrid rowHeight={280}>
          <CardGrid.IconCard
            maxWidth="third"
            iconName="check_circle"
            title="Icon Card"
            description="These are great for listing highlights that don't need images"
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="lock"
            title="There Are A Ton Of Icons"
            description="AppView uses Material Symbols for icons with a huge collection to choose from"
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="star"
            title="Check AppView Docs"
            description="There are sections about using icons and icon cards"
          />
        </CardGrid>
      </Section> */}

      <Section paddingTop={0} paddingBottom={100}>
        <DownloadActionButton
          size="large"
        />
      </Section>
    </>
  );
}
