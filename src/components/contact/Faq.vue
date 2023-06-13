<template>
    <div class="bg-gray-50">
        <div class="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
            <div class="max-w-3xl mx-auto divide-y-2 divide-gray-200">
                <h2
                    class="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl"
                >
                    Frequently asked questions
                </h2>
                <dl class="mt-6 space-y-6 divide-y divide-gray-200">
                    <Disclosure
                        as="div"
                        v-for="faq in faqs"
                        :key="faq.question"
                        class="pt-6"
                        v-slot="{ open }"
                    >
                        <dt class="text-lg">
                            <DisclosureButton
                                class="text-left w-full flex justify-between items-start text-gray-400"
                            >
                                <span class="font-medium text-gray-900">
                                    {{ faq.question }}
                                </span>
                            </DisclosureButton>
                        </dt>
                        <DisclosurePanel as="dd" class="mt-2 pr-12">
                            <p class="text-base text-gray-500">
                                {{ faq.answer }}
                            </p>
                        </DisclosurePanel>
                    </Disclosure>
                </dl>
            </div>
        </div>
    </div>
</template>

<script>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

const faqs = [
    {
        question: "What's the best thing about Switzerland?",
        answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        question: "How do you make holy water?",
        answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        question: "What's the best thing about Switzerland?",
        answer: "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
        question: "How do you make holy water?",
        answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    // More questions...
];

export default {
    components: {
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
    },
    setup() {
        return {
            faqs,
        };
    },
};
</script>
